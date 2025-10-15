import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { UserType } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'Tipo de Usuário', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            clientProfile: true,
            professionalProfile: true
          }
        })

        if (!user) {
          return null
        }

        // Verificar se o usuário tem senha (usuários criados via credenciais)
        if (!user.password) {
          // Usuário criado via Google, não pode fazer login com credenciais
          return null
        }

        // Verificar a senha
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          userType: user.userType,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userType = user.userType
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.userType = token.userType as UserType
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Para login com Google, verificar se o usuário tem perfil completo
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              clientProfile: true,
              professionalProfile: true
            }
          })

          // Se usuário existe mas não tem perfil completo, redirecionar para completar
          if (existingUser && !existingUser.userType) {
            return '/auth/google-signup'
          }

          // Se usuário não existe, criar usuário básico e redirecionar para completar perfil
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name,
                email: user.email!,
                image: user.image,
                userType: 'CLIENT', // Tipo padrão, será atualizado na página de completar perfil
              }
            })
            return '/auth/google-signup'
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
}
