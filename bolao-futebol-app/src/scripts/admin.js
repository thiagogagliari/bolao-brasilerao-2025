import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://rkdwkfiydsicrrxthvfp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk'
const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resultado-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const jogoId = document.getElementById('jogo-id').value;
        const rodada = document.getElementById('rodada').value;
        const mandanteGols = document.getElementById('mandante-gols').value;
        const visitanteGols = document.getElementById('visitante-gols').value;
        const primeiroGol = document.getElementById('primeiro-gol').value;

        const { data, error } = await supabase
            .from('resultados')
            .insert([
                {
                    jogo_id: jogoId,
                    rodada: rodada,
                    mandante_gols: mandanteGols,
                    visitante_gols: visitanteGols,
                    primeiro_gol: primeiroGol
                }
            ]);

        if (error) {
            console.error('Erro ao inserir resultado:', error);
            alert('Erro ao inserir resultado: ' + error.message);
        } else {
            console.log('Resultado inserido com sucesso:', data);
            alert('Resultado inserido com sucesso!');
            form.reset();
        }
    });
});