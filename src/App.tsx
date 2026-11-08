import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Posts from './pages/Posts'
import PostForm from './pages/PostForm'
import Glossary from './pages/Glossary'
import GlossaryForm from './pages/GlossaryForm'
import Quiz from './pages/Quiz'
import QuizForm from './pages/QuizForm'
import Routines from './pages/Routines'
import RoutineForm from './pages/RoutineForm'
import Care from './pages/Care'
import CareForm from './pages/CareForm'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/produtos" element={<Layout><Products /></Layout>} />
        <Route path="/produtos/novo" element={<Layout><ProductForm /></Layout>} />
        <Route path="/produtos/editar/:id" element={<Layout><ProductForm /></Layout>} />
        <Route path="/blog" element={<Layout><Posts /></Layout>} />
        <Route path="/blog/novo" element={<Layout><PostForm /></Layout>} />
        <Route path="/blog/editar/:id" element={<Layout><PostForm /></Layout>} />
        <Route path="/glossario" element={<Layout><Glossary /></Layout>} />
        <Route path="/glossario/novo" element={<Layout><GlossaryForm /></Layout>} />
        <Route path="/glossario/editar/:id" element={<Layout><GlossaryForm /></Layout>} />
        <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
        <Route path="/quiz/novo" element={<Layout><QuizForm /></Layout>} />
        <Route path="/quiz/editar/:id" element={<Layout><QuizForm /></Layout>} />
        <Route path="/rotinas" element={<Layout><Routines /></Layout>} />
        <Route path="/rotinas/novo" element={<Layout><RoutineForm /></Layout>} />
        <Route path="/rotinas/editar/:id" element={<Layout><RoutineForm /></Layout>} />
        <Route path="/cuidados" element={<Layout><Care /></Layout>} />
        <Route path="/cuidados/novo" element={<Layout><CareForm /></Layout>} />
        <Route path="/cuidados/editar/:id" element={<Layout><CareForm /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
