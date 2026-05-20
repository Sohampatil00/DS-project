<div align="center">

<img src="https://img.shields.io/badge/CodeViz-Algorithm%20Learning%20Platform-6366f1?style=for-the-badge&logo=react&logoColor=white" alt="CodeViz" />

<h1>🧠 CodeViz</h1>
<h3><em>Learn to Code — See It Come to Life</em></h3>

<p>
  A free, visual algorithm & data-structure learning platform where every line of code executes live, right before your eyes.
</p>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-EF2D5E?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

</div>

---

## ✨ What is CodeViz?

**CodeViz** is an interactive, browser-based platform that teaches **Data Structures & Algorithms** through real-time visual execution. Instead of passively reading about how a Binary Search Tree traversal works, you _watch_ the tree nodes light up step by step — synchronized with the actual code.

> 🆓 **100% free. No paywalls. No credit card. Ever.**

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🎬 **Visual Execution Engine** | Watch every line of code execute with live animated diagrams |
| 🌐 **4 Languages, 1 Platform** | Switch between **C++**, **Java**, **Python**, and **C** instantly |
| 🖱️ **Interactive Diagrams** | Drag nodes, rewind steps, and explore data structures hands-on |
| 🏆 **Gamified Progress** | Earn XP, maintain streaks, collect badges, and climb leaderboards |
| 💻 **In-Browser IDE** | Full-featured code playground with visualizer — zero setup required |
| 🧭 **Smart Learning Path** | Prerequisite-gated topics so you always learn in the right order |

---

## 📚 Curriculum Overview

CodeViz is organized into **5 modules** spanning **48+ topics** — from first principles to advanced algorithms.

```
📦 Prerequisites       →  Variables, Data Types, Pointers, Syntax (5 topics)
🌱 Beginner DSA        →  Arrays, Loops, Strings, STL & Complexity (9 topics)
🏗️  OOP                →  Classes, Inheritance, Polymorphism, Design Patterns (11 topics)
📊 Data Structures     →  Linked Lists, Trees, Heaps, Graphs, Sorting (12 topics)
🚀 Advanced DS         →  AVL, Red-Black, Segment Tree, Union-Find, DP (12 topics)
```

Every topic is available in **C++, Java, Python, and C**.

---

## 🗂️ Project Structure

```
DS-Project/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── visualizers/     # Algorithm visualizers
│   │   │   ├── BSTVisualizer.tsx
│   │   │   ├── LinkedListVisualizer.tsx
│   │   │   ├── SortingRaceVisualizer.tsx
│   │   │   └── TopicVisualizer.tsx
│   │   ├── Navbar.tsx
│   │   ├── Layout.tsx
│   │   ├── GlassCard.tsx
│   │   ├── NarrationControls.tsx
│   │   └── ...
│   ├── pages/               # Route-level pages
│   │   ├── Landing.tsx      # Hero & marketing page
│   │   ├── Dashboard.tsx    # User progress dashboard
│   │   ├── Courses.tsx      # Browse all modules & topics
│   │   ├── Learn.tsx        # Interactive lesson view
│   │   ├── Playground.tsx   # In-browser code IDE
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Onboarding.tsx
│   ├── data/
│   │   ├── topics.ts        # Topic metadata & module config
│   │   └── topicContent.ts  # Lesson content & code samples
│   ├── store/               # Zustand global state
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility helpers
│   ├── App.tsx              # Root router with animated transitions
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or `pnpm` / `yarn`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Sohampatil00/DS-project.git
cd DS-project

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server with HMR |
| `npm run build` | Type-check & build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) |
| **State Management** | [Zustand 5](https://zustand-demo.pmnd.rs/) |
| **Layout** | [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🌐 App Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, features, modules & CTA |
| `/dashboard` | Personalized learning progress dashboard |
| `/courses` | Full topic browser with filters |
| `/learn/:mod/:topic` | Interactive lesson with visualizer + code |
| `/playground` | Free-form code IDE with visual output |
| `/profile` | User profile and achievements |
| `/login` · `/signup` | Auth flows |
| `/onboarding` | First-time user setup wizard |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

Please follow the existing code style and run `npm run lint` before submitting.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [Soham Patil](https://github.com/Sohampatil00)

⭐ If you find this useful, please **star the repo** — it means a lot!

</div>
