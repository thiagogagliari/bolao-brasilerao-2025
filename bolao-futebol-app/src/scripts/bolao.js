import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://rkdwkfiydsicrrxthvfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk';
const supabase = createClient(supabaseUrl, supabaseKey);

function calcularPontos(palpite, resultado, primeiroGolPalpite, primeiroGolResultado, jogoDobro) {
    let pontos = 0;

    // Se acertar o placar em cheio + 5 pts
    if (palpite.mandante === resultado.mandante && palpite.visitante === resultado.visitante) {
        pontos += 5;
    }

    // Se acertar o número de gols feitos do mandante + 2 pts
    if (palpite.mandante === resultado.mandante) {
        pontos += 2;
    }

    // Se acertar o número de gols feitos do visitante + 2 pts
    if (palpite.visitante === resultado.visitante) {
        pontos += 2;
    }

    // Se acertar a diferença de gols entre os times + 3 pontos
    if ((palpite.mandante - palpite.visitante) === (resultado.mandante - resultado.visitante)) {
        pontos += 3;
    }

    // Se acertar o vencedor ou empate no jogo + 3 pontos
    if ((palpite.mandante > palpite.visitante && resultado.mandante > resultado.visitante) ||
        (palpite.mandante < palpite.visitante && resultado.mandante < resultado.visitante) ||
        (palpite.mandante === palpite.visitante && resultado.mandante === resultado.visitante)) {
        pontos += 3;
    }

    // Se acertar quem marcou o primeiro gol + 2 pontos
    if (primeiroGolPalpite === primeiroGolResultado) {
        pontos += 2;
    }

    // Pontuar em dobro se o jogo foi escolhido para pontuar em dobro
    if (jogoDobro) {
        pontos *= 2;
    }

    return pontos;
}

async function salvarPalpite(userId, rodada, jogo, palpite, primeiroGol, jogoDobro) {
    const { data, error } = await supabase
        .from('palpites')
        .insert([
            {
                user_id: userId,
                rodada: rodada,
                jogo: jogo,
                palpite_mandante: palpite.mandante,
                palpite_visitante: palpite.visitante,
                primeiro_gol: primeiroGol,
                jogo_dobro: jogoDobro
            }
        ]);

    if (error) {
        console.error('Erro ao salvar palpite:', error);
    } else {
        console.log('Palpite salvo com sucesso:', data);
    }
}

async function recuperarPalpites(userId, rodada) {
    const { data, error } = await supabase
        .from('palpites')
        .select('*')
        .eq('user_id', userId)
        .eq('rodada', rodada);

    if (error) {
        console.error('Erro ao recuperar palpites:', error);
    } else {
        console.log('Palpites recuperados:', data);
        return data;
    }
}

async function recuperarResultados(rodada) {
    const { data, error } = await supabase
        .from('resultados')
        .select('*')
        .eq('rodada', rodada);

    if (error) {
        console.error('Erro ao recuperar resultados:', error);
    } else {
        console.log('Resultados recuperados:', data);
        return data;
    }
}

async function salvarPontos(userId, rodada, pontos) {
    const { data, error } = await supabase
        .from('pontos')
        .insert([
            {
                user_id: userId,
                rodada: rodada,
                pontos: pontos
            }
        ]);

    if (error) {
        console.error('Erro ao salvar pontos:', error);
    } else {
        console.log('Pontos salvos com sucesso:', data);
    }

    // Atualizar o ranking
    await atualizarRanking(userId);
}

async function recuperarPontos(userId) {
    const { data, error } = await supabase
        .from('pontos')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        console.error('Erro ao recuperar pontos:', error);
    } else {
        console.log('Pontos recuperados:', data);
        return data;
    }
}

export async function atualizarRanking(userId) {
    const { data: pontos, error: pontosError } = await supabase
        .from('pontos')
        .select('rodada, pontos')
        .eq('user_id', userId);

    if (pontosError) {
        console.error('Erro ao buscar os pontos:', pontosError);
        return;
    }

    const totalPontos = pontos.reduce((acc, ponto) => acc + ponto.pontos, 0);

    const { error: rankingError } = await supabase
        .from('ranking')
        .upsert({ user_id: userId, total_pontos: totalPontos }, { onConflict: 'user_id' });

    if (rankingError) {
        console.error('Erro ao atualizar o ranking:', rankingError);
    }
}

export { calcularPontos, salvarPalpite, recuperarPalpites, recuperarResultados, salvarPontos, recuperarPontos };