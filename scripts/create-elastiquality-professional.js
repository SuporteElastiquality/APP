const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createElastiqualityProfessional() {
  const prisma = new PrismaClient();
  
  try {
    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'elastiquality@elastiquality.pt' }
    });
    
    if (existingUser) {
      console.log('Usuário já existe:', existingUser);
      
      // Verificar se tem perfil profissional
      const professionalProfile = await prisma.professionalProfile.findUnique({
        where: { userId: existingUser.id }
      });
      
      if (professionalProfile) {
        console.log('Perfil profissional já existe:', professionalProfile);
        return;
      } else {
        console.log('Usuário existe mas não tem perfil profissional, criando...');
        
        // Criar perfil profissional
        const newProfile = await prisma.professionalProfile.create({
          data: {
            userId: existingUser.id,
            district: 'Setúbal',
            council: 'Seixal',
            parish: 'Corroios',
            address: 'Praceta Antero de Quental, Corroios',
            postalCode: '2855-094',
            category: 'construcao-reforma',
            specialties: 'Pedreiro,Eletricista,Encanador,Pintor,Gesseiro,Azulejista,Instalador de drywall,Marcenaria e móveis sob medida',
            experience: 'Mais de 10 anos de experiência em construção e reforma residencial e comercial',
            bio: 'A Elastiquality é uma empresa especializada em serviços de construção e reforma, oferecendo soluções completas para residências e empresas. Nossa equipe de profissionais qualificados garante qualidade e pontualidade em todos os projetos.',
            rating: 5.0,
            totalReviews: 0,
            completedJobs: 0,
            isVerified: true,
            isActive: true,
            isPremium: true
          }
        });
        
        console.log('Perfil profissional criado:', newProfile);
      }
    } else {
      console.log('Usuário não existe, criando usuário e perfil profissional...');
      
      // Criar hash da senha
      const hashedPassword = await bcrypt.hash('Elastiquality123!', 12);
      
      // Criar usuário
      const newUser = await prisma.user.create({
        data: {
          name: 'Elastiquality',
          email: 'elastiquality@elastiquality.pt',
          password: hashedPassword,
          userType: 'PROFESSIONAL',
          emailVerified: new Date()
        }
      });
      
      console.log('Usuário criado:', newUser);
      
      // Criar perfil profissional
      const newProfile = await prisma.professionalProfile.create({
        data: {
          userId: newUser.id,
          district: 'Setúbal',
          council: 'Seixal',
          parish: 'Corroios',
          address: 'Praceta Antero de Quental, Corroios',
          postalCode: '2855-094',
          category: 'construcao-reforma',
          specialties: 'Pedreiro,Eletricista,Encanador,Pintor,Gesseiro,Azulejista,Instalador de drywall,Marcenaria e móveis sob medida',
          experience: 'Mais de 10 anos de experiência em construção e reforma residencial e comercial',
          bio: 'A Elastiquality é uma empresa especializada em serviços de construção e reforma, oferecendo soluções completas para residências e empresas. Nossa equipe de profissionais qualificados garante qualidade e pontualidade em todos os projetos.',
          rating: 5.0,
          totalReviews: 0,
          completedJobs: 0,
          isVerified: true,
          isActive: true,
          isPremium: true
        }
      });
      
      console.log('Perfil profissional criado:', newProfile);
    }
    
    console.log('✅ Elastiquality profissional configurada com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar profissional Elastiquality:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createElastiqualityProfessional();