# 📝 Instruções para Adicionar o Logo do Elastiquality

## 🎨 Como Adicionar o Logo Real

### 1. **Preparar o Logo**
- Formato recomendado: **PNG** com fundo transparente
- Tamanho recomendado: **64x64px** ou **128x128px**
- Nome do arquivo: `logo.png`

### 2. **Adicionar o Arquivo**
1. Coloque o arquivo `logo.png` na pasta `public/`
2. O caminho final será: `public/logo.png`

### 3. **Logo Ativado com Cores Originais**

O logo está configurado para aparecer com suas cores originais (sem fundo):

#### **Header** (`components/Header.tsx`)
```tsx
<div className="flex items-center justify-center">
  <img 
    src="/logo.png" 
    alt="Elastiquality" 
    className="w-10 h-10 object-contain"
  />
</div>
```

#### **Footer** (`components/Footer.tsx`)
```tsx
<div className="flex items-center justify-center">
  <img 
    src="/logo.png" 
    alt="Elastiquality" 
    className="w-10 h-10 object-contain"
  />
</div>
```

### 4. **Ajustar Tamanhos (Opcional)**
Se necessário, ajuste os tamanhos:
- `w-8 h-8` = 32x32px
- `w-10 h-10` = 40x40px
- `w-12 h-12` = 48x48px

### 5. **Verificar Resultado**
Após fazer as alterações:
1. Salve os arquivos
2. O servidor recarregará automaticamente
3. Verifique o logo no header e footer

## 🔄 Alternativas de Logo

### **Logo com Fundo**
Se o logo não tiver fundo transparente, você pode:
1. Remover o `bg-gradient-to-br from-primary-600 to-primary-700`
2. Ajustar o `rounded-xl` conforme necessário

### **Logo em SVG**
Para logos em SVG:
1. Renomeie para `logo.svg`
2. Atualize o `src` para `/logo.svg`
3. SVG é recomendado para melhor qualidade

### **Logo Responsivo**
Para diferentes tamanhos em diferentes telas:
```tsx
<img 
  src="/logo.png" 
  alt="Elastiquality" 
  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain"
/>
```

## ✅ Checklist
- [ ] Arquivo `logo.png` na pasta `public/`
- [ ] Header atualizado com imagem
- [ ] Footer atualizado com imagem
- [ ] Logo aparece corretamente
- [ ] Alt text configurado
- [ ] Tamanhos ajustados conforme necessário

## 🎯 Resultado Final
O logo aparecerá em:
- Header (canto superior esquerdo)
- Footer (seção principal)
- Páginas de login e cadastro (se aplicável)
