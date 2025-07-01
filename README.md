# Collaro <img src="public/icons/logo.svg" alt="Collaro Logo" width="30" align="center" />

A modern developer collaboration platform built for remote teams. Collaro seamlessly integrates real-time communication, live streaming, and structured meetings to enhance team productivity.

> 💡 **Want to see how it's built?** Check out my [**Technical Deep Dive**](./learn.md) where I share the challenges, solutions, and lessons learned building this platform with Next.js, Clerk, Stream, and PostgreSQL!

<div align="center">
  <img src="public/images/home.png" alt="Collaro Homepage" width="100%" />
</div>

## ✨ Key Features

<table>
  <tr>
    <td style="text-align: center;">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACrElEQVR4nO2YyWsUQRTGO+McEg96cMPESxRREFzOxuUgxrgHL4J/hEYTPJkQ4nJ0O3rwTzBED5rx4HJRwRUvZoIenUOIyRwV5ycVvoGaYaa7uukmRewPCpru723Vr169qiDIkSNHjhxpAzgETAHzLD/m5csBV+evAjX8Qw0YiXL+qIh/gOvAVqAjWCYAHfLhhnwyvh0JE3iuaEcDzwCMyrdSGKkqUnfgGYBu+VYNIy0h8BRE+ZcHsBL+ANAFXAbeaU2Z8RYYAjq9DgDYCcyG1PIZYIeXAQA9QEUqPgKngDUap4FP+lZJWuXIOIAnEn/WKlWUWtPiTHkVALBPor+AdSG8DcCidtQ9PgUwLtE7Dtx74o75FMCkRAcduOfEfeRTAC8letCxVTd4kcBO/gei1sBdB+59H9fAXokuAOtDeButKrTbt33gscRNre9qsw+UxJlMaGMJyQnR/fpPqfgMnAHWapwFvuib4Wz2LgAD0+eo32mHb8D2ICHIOgDp6AQuAW+U7wt6vuh9N5o1+B8CqIrTk/AKpE+3B6Yj/arWuaLnp8A1cWJf1QBb5NtiGKkU91rFOoGVccdM3BMaMCbZadeLrZtRF1vAsaYT2HfgtsrmLmCThnke1DfDqaMM9Ef81W3ALaeLLQmNtLhafN1C8bjFMyew40DBYSYLwEnrhFZT2jVMlLHZ5MNfYDhKf124Ty3ynIRfNTn/UO/NrAwDRSfFjTaKmiyjw+CBHYQVwJx82R/XRjvDE/XFZFIuBX39VvGI3eDFNTYgQ7/TcL5pLdVzPDW9DQBWAz8UwJUM9I9I92yrZjANAybXDd4DqzLQXwQ+yMZQ2soLVvkbSFW5BeCE9RciK5ozrHNsOVXFrSeqvq8cDtIC0KvUOZ+a0va2LiiVerO2lSNHsALwD+497NBxRU+9AAAAAElFTkSuQmCC" alt="under-computer">
    </td>
    <td>
      <h3>Smart Workspaces</h3>
      <ul>
        <li>Create & join dedicated team spaces</li>
        <li>Role-Based Access Control (RBAC)</li>
        <li>Customizable workspace settings</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADBklEQVR4nO2YS2sUQRDHJyzJMRtB8RCMGx94MWIOovFiLrnoB1BQIyoxihB0L3tQ84AIejAIQkxy9TtoJAcVEXwc9LCCXsQHknyAHDws/KSwZtM79s5jpye6MH9oMumq6n/9p4ue6vW8HDly5MiR4z8FsAu4pKPfa0cA54FVYFGHPJ/z2nAnVoGSZa6/bcqDP74LlnnZmbGseJ2Xh5IvWuaX4gjBZVmmKQ+bH7A7uJ5r3kzKQ96gki/pkOfRzShLp+WhviXx1VHaLF5n5aG+HcAxoKxDnjuy5nVdHkL8DngP3APmgA/AW7Flxeu0PIBtwFdgHOgFTuv8FuCK2rZmUZahAAaA6zoOxPCf0104AkwC23X+ps7dF7tr3lAAd4Efxnn+E3gQESNvfK/EWmyHgX3AF9e8TQFcBF4DPcZcD/AGuBASVwMKwJTFdlVtNde8TQF8BoYs80eBTyFx6N/pKB+XvH8BOGO82S59rhj2rog3mlZIzec1uU1eP8dQGInUyYBDCRLBFpM03oe5ji23pELqO2KxyfFYMQaB/20j6DMWIqTiUkhDmQRsE8CdlGMiRMi0SyFylnc3I3MJGnmLwLWw3CIXCizYp2d70bcFSuMU0NlC0p0a21B23oYI4dzhTIghptykNJaBl0nEqIhXGmtbs2yKaEWI/0H7ZZZTjLinwMkE/rITywn8i5pT6AfVDPiu3esLv+GLSTQjvVUCf+nDZhL4nwWeAXukDYoTsADcAgaBNfn4xNkZOV3CPoKt+gPdKkJyOSitDzDvxWyf17RTHdSdkS21QeZ70wrRdj+M47mKGNLc+uKSjGjApJZZoYmfEAw7EDIsa3l2v4KW05TmNBKXw19gJ/AQ+KYHgI+q4fPIv7mlFDIqa3kbtqrBV9Mc5mPvRFIAt4EbDoTIpWs2kyRjJnPZ/+kmpRC5PI1nmWtUMieAx8HEWhDyBDieZa5x7tVVB0I+AvuzzDUqGbmCrmuPtNKCkBWNXTevtv8Egf5rIOFu1vuqbLPMkSNHjhw5vFD8Bgqw4P8khZweAAAAAElFTkSuQmCC" alt="meeting-room">
    </td>
    <td>
      <h3>Real-Time Communication</h3>
      <ul>
        <li>HD video meetings with screen sharing</li>
        <li>Live streaming for announcements</li>
        <li>Integrated chat during calls</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <img src="public/icons/github.svg" alt="GitHub Integration" width="80" height="80" />
    </td>
    <td>
      <h3>GitHub Integration</h3>
      <ul>
        <li>Link discussions to repositories</li>
        <li>Review pull requests together</li>
        <li>Track issues in context</li>
      </ul>
    </td>
  </tr>
</table>

## 🛠️ Tech Stack

### Frontend Core
[![React 19](https://img.shields.io/badge/React-19.0.0-white?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.2-white?style=for-the-badge&logo=nextdotjs&logoColor=black)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0.0-white?style=for-the-badge&logo=typescript&logoColor=black)](https://www.typescriptlang.org/)

### UI & Design
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0.17-white?style=for-the-badge&logo=tailwind-css&logoColor=black)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-latest-white?style=for-the-badge&logo=radix-ui&logoColor=black)](https://www.radix-ui.com/)
[![Lucide React](https://img.shields.io/badge/Lucide_React-0.479.0-white?style=for-the-badge&logo=lucide&logoColor=black)](https://lucide.dev/)

### State & Forms
[![Zustand](https://img.shields.io/badge/Zustand-5.0.3-white?style=for-the-badge&logo=npm&logoColor=black)](https://zustand-demo.pmnd.rs/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.54.2-white?style=for-the-badge&logo=react-hook-form&logoColor=black)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3.24.2-white?style=for-the-badge&logo=zod&logoColor=black)](https://zod.dev/)

### Communication
[![Stream Video SDK](https://img.shields.io/badge/Stream_Video-1.12.7-white?style=for-the-badge&logo=stream&logoColor=black)](https://getstream.io/video/)

### Security
[![Clerk](https://img.shields.io/badge/Clerk-6.12.4-white?style=for-the-badge&logo=clerk&logoColor=black)](https://clerk.com/)

### Database
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-white?style=for-the-badge&logo=postgresql&logoColor=black)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.40.0-white?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

### DevOps & Tools
[![ESLint 9](https://img.shields.io/badge/ESLint-9.23.0-white?style=for-the-badge&logo=eslint&logoColor=black)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-3.5.3-white?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)
[![Husky](https://img.shields.io/badge/Husky-9.1.7-white?style=for-the-badge&logo=git&logoColor=black)](https://typicode.github.io/husky/)
[![Docker](https://img.shields.io/badge/Docker-latest-white?style=for-the-badge&logo=docker&logoColor=black)](https://www.docker.com/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker (optional)
- Git

### Quick Start 🚀

1. **Clone & Install**
```bash
git clone https://github.com/Coderx85/Collaro.git
cd Collaro
npm install
```

2. **Environment Setup 🔐**

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update the following variables in `.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk public key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `STREAM_API_KEY`: Your Stream API key
- `STREAM_API_SECRET`: Your Stream secret key
- `DATABASE_URL`: Your PostgreSQL connection string
- `RESEND_API_KEY`: Your Resend API key

> **Note:** Never commit `.env` or `.env.local` files to the repository

3. **Development**
```bash
npm run dev     # Start with Turbopack
# or
docker compose up --build   # Start with Docker
```

Visit [http://localhost:3000](http://localhost:3000)