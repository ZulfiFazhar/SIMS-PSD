# Inkubator AI

## Development Guide & Collaboration Standards

Project capstone untuk sistem Inkubator AI yang menganalisis pola belajar siswa menggunakan React + Vite.

> 📖 **Note**: Ini adalah dokumentasi teknis untuk developer. Untuk overview project, lihat [README utama](../README.md).

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Naming Conventions](#naming-conventions)
- [Git Workflow](#git-workflow)
- [Setup & Installation](#setup--installation)
- [Development Guidelines](#development-guidelines)
- [Code Style](#code-style)

## 🛠 Tech Stack

- **Language**: TypeScript
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Router**: React Router DOM v7
- **Package Manager**: npm

## 📁 Folder Structure

```
frontend/
├── docs/                   # Dokumentasi project
│   └── README.md
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── admin/          # Admin components (Header, Footer, dll)
│   │   ├── auth/           # Auth components (Header, Footer, dll)
│   │   ├── layout/         # Layout components (Header, Footer, dll)
│   │   ├── lecturer/       # Lecturer components (Header, Footer, dll)
│   │   └── student/        # Student components (Header, Footer, dll)
│   ├── context/            # Context providers
│   ├── pages/              # Page components (route-based)
│   ├── services/           # API services & business logic
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities & configurations
│   ├── routes/             # Route definitions
│   ├── styles/             # Global styles
│   │   └── global.css
│   ├── types.ts            # TypeScript type definitions
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables (not committed)
├── .env.example            # Example env file
└── package.json
```

## 📝 Naming Conventions

### 1. **Files & Folders**

#### Components

- **Format**: PascalCase, kecuali komponen shadcn/ui yang mengikuti naming mereka
- **Extension**: `.tsx` untuk file dengan JSX, `.ts` untuk pure TypeScript
- **Example**:
  ```
  ✅ Button.tsx
  ✅ TodoItem.tsx
  ✅ UserProfile.tsx
  ❌ button.tsx
  ❌ todo-item.tsx
  ```

#### Pages

- **Format**: PascalCase
- **Extension**: `.tsx`
- **Example**:
  ```
  ✅ LandingPage.tsx
  ✅ Todo.tsx
  ✅ Dashboard.tsx
  ```

#### Services

- **Format**: PascalCase dengan suffix `Service`
- **Extension**: `.ts`
- **Example**:
  ```
  ✅ TodoService.ts
  ✅ AuthService.ts
  ✅ UserService.ts
  ```

#### Hooks

- **Format**: camelCase dengan prefix `use`
- **Extension**: `.ts` | `.tsx` (jika return JSX)
- **Example**:
  ```
  ✅ useTodos.ts
  ✅ useAuth.ts
  ✅ useDebounce.ts
  ```

#### Utils/Lib

- **Format**: camelCase
- **Extension**: `.ts`
- **Example**:
  ```
  ✅ utils.ts
  ✅ supabaseClient.ts
  ✅ constants.ts
  ```

#### Folders

- **Format**: lowercase dengan dash untuk separator
- **Example**:
  ```
  ✅ components/
  ✅ custom-hooks/
  ✅ api-services/
  ❌ Components/
  ❌ customHooks/
  ```

### 2. **Variables & Functions**

#### Variables

- **Format**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Example**:

  ```typescript
  // Variables
  const userName: string = "John";
  const todoList: Todo[] = [];
  let isLoading: boolean = false;

  // Constants
  const API_URL = "https://api.example.com";
  const MAX_RETRIES = 3;
  ```

#### Functions

- **Format**: camelCase, verb-based naming
- **Example**:

  ```typescript
  ✅ function fetchTodos(): Promise<Todo[]> {}
  ✅ const handleSubmit = (e: React.FormEvent) => {};
  ✅ async function deleteUser(id: string): Promise<void> {}

  ❌ function todos() {}
  ❌ const submit = () => {};
  ```

#### React Components

- **Format**: PascalCase
- **Example**:
  ```typescript
  ✅ function TodoItem({ todo }: TodoItemProps) {}
  ✅ const UserCard: React.FC<UserCardProps> = ({ user }) => {};
  ✅ export default function LandingPage() {}
  ```

#### Event Handlers

- **Format**: camelCase dengan prefix `handle` atau `on`
- **Example**:
  ```javascript
  ✅ const handleClick = () => {};
  ✅ const onSubmit = () => {};
  ✅ const handleInputChange = () => {};
  ```

#### Boolean Variables

- **Format**: prefix dengan `is`, `has`, `should`, `can`
- **Example**:
  ```typescript
  ✅ const isLoading = true;
  ✅ const hasError = false;
  ✅ const shouldUpdate = true;
  ✅ const canDelete = false;
  ```

### 3. **CSS Classes**

- **Format**: kebab-case (mengikuti Tailwind utility classes)
- **Custom classes**: kebab-case
- **Example**:
  ```css
  ✅ .todo-item {
  }
  ✅ .user-profile-card {
  }
  ❌ .todoItem {
  }
  ❌ .UserProfileCard {
  }
  ```

## 🌿 Git Workflow

### Branch Naming

**Format**: `<type>/<short-description>`

**Types**:

- `feat/` - Fitur baru
- `fix/` - Bug fixes
- `hotfix/` - Urgent fixes
- `ref/` - Code refactoring
- `docs/` - Documentation updates
- `style/` - Styling changes
- `test/` - Adding tests
- `chore/` - Maintenance tasks

**Example**:

```bash
✅ feat/add-user-authentication
✅ fix/todo-delete-button
✅ ref/todo-service-to-class
✅ docs/update-readme
❌ feat-user-auth
❌ AddUserAuth
❌ fix_bug
```

### Commit Messages

**Format**: `<type>: <description>`

**Types**:

- `feat` - New feature
- `fix` - Bug fix
- `ref` - Code refactoring
- `docs` - Documentation
- `style` - Formatting
- `test` - Tests
- `chore` - Maintenance

**Example**:

```bash
✅ feat: add user authentication with Supabase
✅ fix: resolve todo deletion not working
✅ ref: convert todo service to class-based
✅ docs: update installation guide
❌ added feature
❌ Fixed bug
❌ update
```

### Workflow

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Create branch dari `main`**

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. **Push branch**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create Pull Request**

   - Buat PR ke branch `dev`
   - Tambahkan description yang jelas
   - Request review dari team member
   - Tunggu approval sebelum merge

6. **Merge ke dev**

   - Gunakan "Squash and merge" untuk history yang clean
   - Delete branch setelah merge

## 🚀 Setup & Installation

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Akun Supabase

### Installation Steps

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` dan isi:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Supabase database**

   - Buka Supabase Project > SQL Editor
   - Copy paste isi `supabase_seed.sql`
   - Run query

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Build for production**

   ```bash
   npm run build
   ```

## 👨‍💻 Development Guidelines

### 1. **Component Guidelines**

#### Struktur Component

```tsx
// Imports
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Todo {
  id: string;
  title: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// Component
export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Hooks
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Event Handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Render
  return <div>{/* JSX */}</div>;
}
```

#### Component Best Practices

- **Single Responsibility**: Satu component satu tugas
- **Props Validation**: Gunakan PropTypes atau TypeScript
- **Destructure Props**: Lebih readable
- **Early Return**: Handle edge cases di awal
- **Extract Logic**: Pisahkan business logic ke hooks/services

**Example**:

```tsx
// ❌ Bad
export default function TodoItem(props: any) {
  return <div>{props.todo.title}</div>;
}

// ✅ Good
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  if (!todo) return null;

  return (
    <div>
      <span>{todo.title}</span>
      <button onClick={() => onToggle(todo.id)}>Toggle</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}
```

### 2. **Service Layer Guidelines**

#### Class-based Services

```typescript
import { SupabaseClient } from "@supabase/supabase-js";

class TodoService {
  private tableName: string;

  constructor() {
    this.tableName = "todos";
  }

  async getAll(): Promise<Todo[]> {
    // Implementation
    return [];
  }

  async create(data: Omit<Todo, "id">): Promise<Todo | null> {
    // Implementation
    return null;
  }
}

export const todoService = new TodoService();
```

#### Service Best Practices

- **Error Handling**: Throw errors, handle di component
- **Single Responsibility**: Satu service satu entity
- **Async/Await**: Gunakan async/await untuk promises
- **Named Exports**: Export instance, bukan class

### 3. **State Management**

#### Local State

- Gunakan `useState` untuk UI state
- Gunakan `useReducer` untuk complex state logic

#### Server State

- Fetch di `useEffect`
- Handle loading, error, dan success states
- Implement optimistic updates untuk UX yang lebih baik

**Example**:

```tsx
const [todos, setTodos] = useState<Todo[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await todoService.getAll();
      setTodos(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### 4. **Styling Guidelines**

#### Tailwind CSS

- Gunakan utility classes
- Avoid inline styles kecuali dynamic values
- Gunakan `cn()` helper untuk conditional classes

**Example**:

```jsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "rounded-lg p-4",
    isActive && "bg-blue-500",
    isDisabled && "opacity-50"
  )}
>
  Content
</div>;
```

#### Custom Components (shadcn/ui)

- Letakkan di `components/ui/`
- Jangan modifikasi langsung, extend dengan composition
- Follow shadcn/ui naming conventions

### 5. **Import Organization**

**Order**:

1. External libraries
2. Internal aliases (@/)
3. Relative imports
4. Styles

**Example**:

```jsx
// External
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Internal (@/)
import { Button } from "@/components/ui/button";
import { todoService } from "@/services/TodoService";
import { cn } from "@/lib/utils";

// Relative
import TodoItem from "./TodoItem";

// Styles (if any)
import "./styles.css";
```

## 🎨 Code Style

### ESLint & Prettier

- Follow ESLint rules yang sudah di-configure
- Format code sebelum commit
- Run linter:
  ```bash
  npm run lint
  ```

### Code Formatting

- **Indentation**: 2 spaces
- **Quotes**: Double quotes untuk strings
- **Semicolons**: Required
- **Trailing commas**: Yes
- **Arrow functions**: Preferred untuk callbacks

### Comments

- Gunakan comments untuk explain "why", bukan "what"
- Hindari comment yang redundant
- Gunakan JSDoc untuk function documentation

**Example**:

```javascript
// ❌ Bad
// Set loading to true
setLoading(true);

// ✅ Good
// Prevent race condition by debouncing search
const debouncedSearch = debounce(handleSearch, 300);
```

## 🧪 Testing (TODO)

- Unit tests: Jest + React Testing Library
- E2E tests: Playwright/Cypress
- Coverage target: >80%

## 🔒 Security

- **Never commit** `.env` files
- **Always validate** user inputs
- **Sanitize** data sebelum render
- **Use** Supabase RLS untuk production

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
