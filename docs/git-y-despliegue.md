# Git y despliegue

Repositorio: **https://github.com/Adonay86/QResto**

## Subir cambios

```powershell
cd C:\Users\adona\Projects\QResto
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" -c user.name="Carlos Adonay Gomez Gonzalez" -c user.email="Adonaygomez27@gmail.com" commit -m "Describe tu cambio"
& "C:\Program Files\Git\bin\git.exe" push
```

Remote SSH: `git@github.com:Adonay86/QResto.git`

Ver también: [configurar-ssh-github.md](./configurar-ssh-github.md)
