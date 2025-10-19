'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Settings, MessageCircle, Coins } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Elastiquality"
                width={200}
                height={200}
                className="w-[200px] h-[200px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {session?.user?.userType === 'PROFESSIONAL' ? (
              <>
                <Link href="/services" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Serviços
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Como Funciona
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sobre
                </Link>
              </>
            ) : (
              <>
                <Link href="/services" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Serviços
                </Link>
                <Link href="/professionals" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Profissionais
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Como Funciona
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Sobre
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="spinner"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{session.user.name}</span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      href={session.user.userType === 'CLIENT' ? '/profile/client' : '/profile/professional'}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Mensagens
                    </Link>
                    {session.user.userType === 'PROFESSIONAL' && (
                      <Link
                        href="/quality"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Image
                          src="/favicon-32x32.png"
                          alt="Quality"
                          width={16}
                          height={16}
                          className="mr-3"
                        />
                        Quality
                      </Link>
                    )}
                    <Link
                      href={session.user.userType === 'CLIENT' ? '/profile/client/settings' : '/profile/professional/settings'}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Configurações
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-primary"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 relative z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {session?.user?.userType === 'PROFESSIONAL' ? (
                <>
                  <Link
                    href="/services"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Serviços
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Como Funciona
                  </Link>
                  <Link
                    href="/about"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sobre
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/services"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Serviços
                  </Link>
                  <Link
                    href="/professionals"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profissionais
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Como Funciona
                  </Link>
                  <Link
                    href="/about"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sobre
                  </Link>
                </>
              )}
              
              {session ? (
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User'}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {session.user.userType === 'PROFESSIONAL' ? 'Profissional' : 'Cliente'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Dashboard
                  </Link>
                  
                  <Link
                    href={session.user.userType === 'CLIENT' ? '/profile/client' : '/profile/professional'}
                    className="flex items-center px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Meu Perfil
                  </Link>
                  
                  <Link
                    href="/messages"
                    className="flex items-center px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Mensagens
                  </Link>
                  
                  {session.user.userType === 'PROFESSIONAL' && (
                    <Link
                      href="/quality"
                      className="flex items-center px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Image
                        src="/favicon-32x32.png"
                        alt="Quality"
                        width={16}
                        height={16}
                        className="mr-3"
                      />
                      Quality
                    </Link>
                  )}
                  
                  <Link
                    href={session.user.userType === 'CLIENT' ? '/profile/client/settings' : '/profile/professional/settings'}
                    className="flex items-center px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Configurações
                  </Link>
                  
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block mx-3 btn-primary text-center min-h-[44px] flex items-center justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay para fechar dropdowns */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}
