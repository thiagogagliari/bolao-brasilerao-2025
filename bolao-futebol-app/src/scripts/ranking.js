import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://rkdwkfiydsicrrxthvfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const filtroRanking = document.getElementById('filtro-ranking');
    const listaRanking = document.getElementById('lista-ranking');

    filtroRanking.addEventListener('change', async (event) => {
        const filtro = event.target.value;
        await carregarRanking(filtro);
    });

    await carregarRanking('geral');

    async function carregarRanking(filtro) {
        listaRanking.innerHTML = 'Classificação Geral';

        let query = supabase
            .from('ranking')
            .select('username, total_pontos')
            .order('total_pontos', { ascending: false });

        if (filtro !== 'geral') {
            query = supabase
                .from('ranking')
                .select('username, pontos')
                .eq('rodada', filtro)
                .order('pontos', { ascending: false });
        }

        const { data: ranking, error } = await query;

        if (error) {
            console.error('Erro ao buscar o ranking:', error.message);
            return;
        }

        ranking.forEach((user, index) => {
            const li = document.createElement('li');
            li.textContent = filtro === 'geral' 
                ? `${index + 1}. ${user.username}: ${user.total_pontos} pontos`
                : `${index + 1}. ${user.username}: ${user.pontos} pontos`;
            listaRanking.appendChild(li);
        });
    }
});