import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://rkdwkfiydsicrrxthvfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const userInfo = document.getElementById('user-info');
    const userSelect = document.getElementById('user-select');
    const palpitesList = document.getElementById('palpites-list');

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Erro ao buscar o usuário:', error);
        alert('Erro ao buscar o usuário.');
        window.location.href = 'login.html';
        return;
    }

    if (!user) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // Buscar o nome do usuário na tabela user_profiles
    const { data: userProfile, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('user_id', user.id)
        .single();

    if (userProfileError) {
        console.error('Erro ao buscar o perfil do usuário:', userProfileError);
        userInfo.innerHTML = 'Bem-vindo, Usuário';
    } else {
        console.log('Perfil do usuário:', userProfile);
        userInfo.innerHTML = `Bem-vindo, ${userProfile.username} <button id="logout-button" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Logout</button>`;
    }

    document.getElementById('logout-button').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = 'login.html';
    });

    // Buscar todos os usernames
    const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('user_id, username');

    if (usersError) {
        console.error('Erro ao buscar os usuários:', usersError);
        return;
    }

    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.user_id;
        option.textContent = user.username;
        userSelect.appendChild(option);
    });

    userSelect.addEventListener('change', async (event) => {
        const userId = event.target.value;
        if (userId) {
            await carregarPalpites(userId);
        } else {
            palpitesList.innerHTML = '';
        }
    });

    async function carregarPalpites(userId) {
        // Buscar todos os palpites do usuário selecionado
        const { data: palpites, error: palpitesError } = await supabase
            .from('palpites')
            .select('rodada, jogo, palpite_mandante, palpite_visitante, primeiro_gol, jogo_dobro')
            .eq('user_id', userId);

        if (palpitesError) {
            console.error('Erro ao buscar os palpites:', palpitesError);
            return;
        }

        palpitesList.innerHTML = '';
        palpites.forEach(palpite => {
            const li = document.createElement('li');
            li.textContent = `Rodada: ${palpite.rodada}, Jogo: ${palpite.jogo}, Palpite: ${palpite.palpite_mandante} x ${palpite.palpite_visitante}, Primeiro Gol: ${palpite.primeiro_gol}, Jogo em Dobro: ${palpite.jogo_dobro ? 'Sim' : 'Não'}`;
            palpitesList.appendChild(li);
        });
    }
});