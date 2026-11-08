import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ToastHost from './components/ToastHost'

const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Products = lazy(() => import('./pages/Products'))
const ProductForm = lazy(() => import('./pages/ProductForm'))
const Posts = lazy(() => import('./pages/Posts'))
const PostForm = lazy(() => import('./pages/PostForm'))
const Glossary = lazy(() => import('./pages/Glossary'))
const GlossaryForm = lazy(() => import('./pages/GlossaryForm'))
const Quiz = lazy(() => import('./pages/Quiz'))
const QuizForm = lazy(() => import('./pages/QuizForm'))
const Routines = lazy(() => import('./pages/Routines'))
const RoutineForm = lazy(() => import('./pages/RoutineForm'))
const Care = lazy(() => import('./pages/Care'))
const CareForm = lazy(() => import('./pages/CareForm'))
const Layout = lazy(() => import('./components/Layout'))
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'))

const loadingView = (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top, rgba(124,58,237,0.12), transparent 35%), #f8fafc' }}>
    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '20px', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)', padding: '32px 36px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: '42px', marginBottom: '12px' }}>⏳</div>
      <p style={{ color: '#4b5563', fontSize: '16px', fontWeight: 600, margin: 0 }}>Carregando módulo...</p>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <ToastHost />
      <Suspense fallback={loadingView}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/produtos" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
          <Route path="/produtos/novo" element={<ProtectedRoute><Layout><ProductForm /></Layout></ProtectedRoute>} />
          <Route path="/produtos/editar/:id" element={<ProtectedRoute><Layout><ProductForm /></Layout></ProtectedRoute>} />
          <Route path="/blog" element={<ProtectedRoute><Layout><Posts /></Layout></ProtectedRoute>} />
          <Route path="/blog/novo" element={<ProtectedRoute><Layout><PostForm /></Layout></ProtectedRoute>} />
          <Route path="/blog/editar/:id" element={<ProtectedRoute><Layout><PostForm /></Layout></ProtectedRoute>} />
          <Route path="/glossario" element={<ProtectedRoute><Layout><Glossary /></Layout></ProtectedRoute>} />
          <Route path="/glossario/novo" element={<ProtectedRoute><Layout><GlossaryForm /></Layout></ProtectedRoute>} />
          <Route path="/glossario/editar/:id" element={<ProtectedRoute><Layout><GlossaryForm /></Layout></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Layout><Quiz /></Layout></ProtectedRoute>} />
          <Route path="/quiz/novo" element={<ProtectedRoute><Layout><QuizForm /></Layout></ProtectedRoute>} />
          <Route path="/quiz/editar/:id" element={<ProtectedRoute><Layout><QuizForm /></Layout></ProtectedRoute>} />
          <Route path="/rotinas" element={<ProtectedRoute><Layout><Routines /></Layout></ProtectedRoute>} />
          <Route path="/rotinas/novo" element={<ProtectedRoute><Layout><RoutineForm /></Layout></ProtectedRoute>} />
          <Route path="/rotinas/editar/:id" element={<ProtectedRoute><Layout><RoutineForm /></Layout></ProtectedRoute>} />
          <Route path="/cuidados" element={<ProtectedRoute><Layout><Care /></Layout></ProtectedRoute>} />
          <Route path="/cuidados/novo" element={<ProtectedRoute><Layout><CareForm /></Layout></ProtectedRoute>} />
          <Route path="/cuidados/editar/:id" element={<ProtectedRoute><Layout><CareForm /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
