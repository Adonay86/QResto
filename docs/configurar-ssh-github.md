# Configuración SSH para GitHub — QResto

## Estado

- Clave SSH generada: `%USERPROFILE%\.ssh\id_ed25519`
- Remote del proyecto: `git@github.com:Adonay86/QResto.git`

## Añadir la clave en GitHub (solo una vez)

1. Abre: https://github.com/settings/ssh/new
2. **Title:** `PC Carlos - QResto`
3. **Key:** pega la clave pública (ya está en tu portapapeles) o ejecuta:
   ```powershell
   Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
   ```
4. Clic en **Add SSH key**

## Probar que funciona

```powershell
ssh -T git@github.com
```

Debería decir: `Hi Adonay86! You've successfully authenticated...`

## Subir cambios con SSH

```powershell
cd C:\Users\adona\Projects\QResto
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Describe el cambio"
& "C:\Program Files\Git\bin\git.exe" push
```

## Tu clave pública

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPyeNbJTELb5RoZEC2yrRwqm4n/8g1SysIs+EHQCW+oV Adonaygomez27@gmail.com
```
