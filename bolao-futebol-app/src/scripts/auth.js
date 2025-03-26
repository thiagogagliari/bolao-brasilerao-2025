import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://rkdwkfiydsicrrxthvfp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk'
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', () => {
    // Lógica de login
    const loginForm = document.getElementById('login-form')
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value

            const { error, data } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                alert('Erro ao fazer login: ' + error.message)
            } else {
                alert('Login realizado com sucesso!')
                window.location.href = 'dashboard.html'
            }
        })
    }

    // Lógica de cadastro
    const cadastroForm = document.getElementById('cadastro-form')
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault()
            const email = document.getElementById('email').value
            const password = document.getElementById('password').value
            const username = document.getElementById('username').value

            const { error, data } = await supabase.auth.signUp({ email, password })
            if (error) {
                alert('Erro ao fazer cadastro: ' + error.message)
            } else {
                // Criar perfil de usuário na tabela user_profiles
                const { user } = data
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .insert([{ user_id: user.id, username }])

                if (profileError) {
                    alert('Erro ao criar perfil de usuário: ' + profileError.message)
                } else {
                    alert('Cadastro realizado com sucesso! Clique no link de confirmação enviado por e-mail')
                    window.location.href = 'login.html'
                }
            }
        })
    }
})