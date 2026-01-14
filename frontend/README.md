# 📄 FileSwitch

**FileSwitch** is a premium, high-performance web application designed for seamless file conversion and document editing. Built with a modern **Glass Morphism** aesthetic, it provides an intuitive and visually stunning experience for managing your documents on both desktop and mobile.

![FileSwitch Banner](https://img.shields.io/badge/UI-Glass--Morphism-3a86ff?style=for-the-badge&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

---

## ✨ Features

- **🚀 Smart Conversion**: Instantly convert between PDF and DOCX formats with high fidelity.
- **✍️ Rich Text Editor**: A full-featured document editor powered by Quill, complete with advanced formatting tools.
- **📱 Mobile-Optimized Toolbar**: A custom-built, paginated toolbar for mobile users, ensuring all advanced tools are accessible without clutter.
- **🎨 Premium UI**: Full glass-morphism design with vibrant blue accents, smooth transitions, and a responsive layout.
- **💾 Auto-Download**: Direct download of converted files with custom naming support.
- **🌊 Fluid Experience**: Fade-in animations and intuitive Drag & Drop file uploads.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS (Custom properties), MUI (Material UI), Styled Components
- **Editor Core**: React-Quill, Quill.js
- **Icons**: Lucide-React, MUI Icons
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📂 Project Structure

The codebase is organized into feature-based modules for better maintainability:

```text
src/
├── components/
│   ├── common/        # Shared layout components (Header, Footer)
│   ├── home/          # Components specific to the conversion homepage
│   └── editor/        # Rich text editor components and custom tools
├── pages/             # Main page entry points (Home, TextEditorPage)
├── styles/            # Global themes and CSS variable definitions
├── assets/            # Static assets and images
└── App.jsx            # Routing and global provider setup
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mgiftson0/fileswitch.git
   cd fileswitch/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_BASE_URL=https://fileswitch-8zjy.onrender.com
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🧑‍💻 Author

**manuel**
- GitHub: [@mgiftson0](https://github.com/mgiftson0)
- Email: [mgfiton00@gmail.com](mailto:mgfiton00@gmail.com)

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
