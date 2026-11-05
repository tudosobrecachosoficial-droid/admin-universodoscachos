import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Posts from './pages/Posts'
import PostForm from './pages/PostForm'
import Glossary from './pages/Glossary'
import Quiz from './pages/Quiz'
import Routines from './pages/Routines'
import Care from './pages/Care'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/produtos" element={<Layout><Products /></Layout>} />
        <Route path="/blog" element={<Layout><Posts /></Layout>} />
        <Route path="/blog/novo" element={<Layout><PostForm /></Layout>} />
        <Route path="/blog/editar/:id" element={<Layout><PostForm /></Layout>} />
        <Route path="/glossario" element={<Layout><Glossary /></Layout>} />
        <Route path="/quiz" element={<Layout><Quiz /></Layout>} />
        <Route path="/rotinas" element={<Layout><Routines /></Layout>} />
        <Route path="/cuidados" element={<Layout><Care /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
