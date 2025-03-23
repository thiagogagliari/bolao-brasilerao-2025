import { salvarPalpite, recuperarPalpites, recuperarResultados, salvarPontos, recuperarPontos, calcularPontos, atualizarRanking } from './bolao.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://rkdwkfiydsicrrxthvfp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('palpite-form');
    const betsList = document.getElementById('lista-palpites');
    const jogosContainer = document.getElementById('jogos-container');
    const pontosTotaisContainer = document.getElementById('pontos-totais');
    const pontosRodadaContainer = document.getElementById('pontos-rodada');
    const userInfo = document.getElementById('user-info');
    const btnRanking = document.getElementById('btn-ranking');
    const rankingList = document.getElementById('ranking-list');
    const mensagem = document.getElementById('mensagem');

    const prazoFinal = new Date(2025, 2, 29, 18, 30); // 24 de março de 2025 às 18:00 (mês começa em 0)

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Erro ao buscar a sessão:', error);
        alert('Erro ao buscar a sessão.');
        window.location.href = 'login.html';
        return;
    }

    if (!session) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    const user = session.user;

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

    const userId = user.id;
    let rodada = 1;

    const jogosRodada1 = [
        { id: 1, mandante: 'CRU', visitante: 'MIR', escudoMandante: './assets/cruzeiro.png', escudoVisitante: './assets/mirassol.png' },
        { id: 2, mandante: 'FOR', visitante: 'FLU', escudoMandante: './assets/fortaleza.png', escudoVisitante: './assets/fluminense.png' },
        { id: 3, mandante: 'GRE', visitante: 'CAM', escudoMandante: './assets/gremio.png', escudoVisitante: './assets/atletico-mg.png'},
        { id: 4, mandante: 'JUV', visitante: 'VIT', escudoMandante: './assets/juventude.png', escudoVisitante: './assets/vitoria.png'},
        { id: 5, mandante: 'SÃO', visitante: 'SPO', escudoMandante: './assets/sao-paulo.png', escudoVisitante: './assets/sport.png'},
        { id: 6, mandante: 'FLA', visitante: 'INT', escudoMandante: './assets/flamengo.png', escudoVisitante: './assets/internacional.png'},
        { id: 7, mandante: 'PAL', visitante: 'BOT', escudoMandante: './assets/palmeiras.png', escudoVisitante: './assets/botafogo.png'},
        { id: 8, mandante: 'VAS', visitante: 'SAN', escudoMandante: './assets/vasco.png', escudoVisitante: './assets/santos.png'},
        { id: 9, mandante: 'BAH', visitante: 'COR', escudoMandante: './assets/bahia.png', escudoVisitante: './assets/corinthians.png'},
        { id: 10, mandante: 'BRA', visitante: 'CEA', escudoMandante: './assets/rb-bragantino.png', escudoVisitante: './assets/ceara.png'}
    ];

    const jogosRodada2 = [
        // { id: 4, mandante: 'Palmeiras', visitante: 'São Paulo', escudoMandante: './assets/palmeiras.png', escudoVisitante: './assets/sao-paulo.png' },
        // { id: 5, mandante: 'Santos', visitante: 'Corinthians', escudoMandante: './assets/santos.png', escudoVisitante: './assets/corinthians.png' },
        // { id: 6, mandante: 'Internacional', visitante: 'Botafogo', escudoMandante: './assets/internacional.png', escudoVisitante: './assets/botafogo.png'},
    ];

    const jogosPorRodada = {
        1: jogosRodada1,
        2: jogosRodada2,
        // Adicione mais rodadas conforme necessário
    };

    const rodadaSelect = document.getElementById('rodada-select');
    rodadaSelect.addEventListener('change', async (event) => {
        rodada = parseInt(event.target.value);
        await carregarJogosEResultados(rodada);
    });

    await carregarJogosEResultados(rodada);

    async function carregarJogosEResultados(rodada) {
        jogosContainer.innerHTML = '';
        const jogos = jogosPorRodada[rodada];
        const resultados = await recuperarResultados(rodada);
        const palpites = await recuperarPalpites(userId, rodada);

        jogos.forEach(jogo => {
            const jogoDiv = document.createElement('div');
            jogoDiv.classList.add('jogo');

            const resultado = resultados.find(r => r.jogo_id === jogo.id);
            const palpiteExistente = palpites.find(p => p.jogo === jogo.id);

            let pontosJogo = 0;
            if (resultado && palpiteExistente) {
                pontosJogo = calcularPontos(
                    { mandante: palpiteExistente.palpite_mandante, visitante: palpiteExistente.palpite_visitante },
                    { mandante: resultado.mandante_gols, visitante: resultado.visitante_gols },
                    palpiteExistente.primeiro_gol, resultado.primeiro_gol, palpiteExistente.jogo_dobro
                );
            }

            jogoDiv.innerHTML = resultado ? `
                <img src="${jogo.escudoMandante}" alt="${jogo.mandante}" class="escudo">
                <span>${jogo.mandante}</span>
                <span>${resultado.mandante_gols}</span>
                <span>vs</span>
                <span>${resultado.visitante_gols}</span>
                <span>${jogo.visitante}</span>
                <img src="${jogo.escudoVisitante}" alt="${jogo.visitante}" class="escudo">
                <span>Primeiro Gol: ${resultado.primeiro_gol}</span>
                <span class="pontos-jogo">${pontosJogo} pontos</span>
            ` : palpiteExistente ? `
                <img src="${jogo.escudoMandante}" alt="${jogo.mandante}" class="escudo">
                <span>${jogo.mandante}</span>
                <span>${palpiteExistente.palpite_mandante}</span>
                <span>vs</span>
                <span>${palpiteExistente.palpite_visitante}</span>
                <span>${jogo.visitante}</span>
                <img src="${jogo.escudoVisitante}" alt="${jogo.visitante}" class="escudo">
                <span>Primeiro Gol: ${palpiteExistente.primeiro_gol}</span>
                ${palpiteExistente.jogo_dobro ? '<span class="bola-dobro">⚽</span>' : ''}
                <span class="pontos-jogo">${pontosJogo} pontos</span>
            ` : `
                <img src="${jogo.escudoMandante}" alt="${jogo.mandante}" class="escudo">
                <span>${jogo.mandante}</span>
                <input type="number" name="palpite-mandante-${jogo.id}" placeholder="" required>
                <span>vs</span>
                <input type="number" name="palpite-visitante-${jogo.id}" placeholder="" required>
                <span>${jogo.visitante}</span>
                <img src="${jogo.escudoVisitante}" alt="${jogo.visitante}" class="escudo">
                <label for="primeiro-gol-${jogo.id}">Primeiro Gol:</label>
                <select name="primeiro-gol-${jogo.id}" required>
                    <option value="mandante">Mandante</option>
                    <option value="nenhum">Nenhum</option>
                    <option value="visitante">Visitante</option>
                </select>
                <label for="jogo-dobro-${jogo.id}">BÔNUS:</label>
                <input type="checkbox" name="jogo-dobro-${jogo.id}" class="jogo-dobro-checkbox">
            `;
            jogosContainer.appendChild(jogoDiv);
        });

        // Adicionar evento para permitir apenas um jogo com pontos em dobro
        const checkboxesDobro = document.querySelectorAll('.jogo-dobro-checkbox');
        checkboxesDobro.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    checkboxesDobro.forEach(cb => {
                        if (cb !== event.target) {
                            cb.checked = false;
                        }
                    });
                }
            });
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const agora = new Date();
            if (agora >= prazoFinal) {
                mensagem.innerHTML = "<span style='color: red;'>⛔ Palpites encerrados! O prazo acabou.</span>";
                return;
            }

            const palpitesPromises = jogos.map(async (jogo) => {
                const palpiteMandante = document.querySelector(`input[name="palpite-mandante-${jogo.id}"]`);
                const palpiteVisitante = document.querySelector(`input[name="palpite-visitante-${jogo.id}"]`);
                const primeiroGol = document.querySelector(`select[name="primeiro-gol-${jogo.id}"]`);
                const jogoDobro = document.querySelector(`input[name="jogo-dobro-${jogo.id}"]`);

                if (!palpiteMandante.value || !palpiteVisitante.value || !primeiroGol.value) {
                    alert('Por favor, preencha todos os campos obrigatórios.');
                    return;
                }

                // Verificar se já existe um jogo marcado como "jogo em dobro"
                const jogoDobroExistente = palpites.find(p => p.jogo_dobro);
                if (jogoDobro.checked && jogoDobroExistente) {
                    alert('Você só pode marcar um jogo como "jogo em dobro" por rodada.');
                    return;
                }

                const palpiteExistente = palpites.find(p => p.jogo === jogo.id);
                if (!palpiteExistente) {
                    await salvarPalpite(userId, rodada, jogo.id, { mandante: +palpiteMandante.value, visitante: +palpiteVisitante.value }, primeiroGol.value, jogoDobro.checked);
                }
            });

            await Promise.all(palpitesPromises);
            mensagem.innerHTML = "<span style='color: green;'>✅ Palpite enviado com sucesso!</span>";
            const novosPalpites = await recuperarPalpites(userId, rodada);
            atualizarListaPalpites(novosPalpites, betsList);
            await calcularESalvarPontos(userId, rodada, novosPalpites, resultados, pontosTotaisContainer, pontosRodadaContainer);
            await atualizarRanking(userId); // Atualizar o ranking após salvar os pontos
            window.location.reload(); // Recarregar a página para atualizar os palpites e bloquear os campos
        });

        await calcularESalvarPontos(userId, rodada, palpites, resultados, pontosTotaisContainer, pontosRodadaContainer);
        await atualizarRanking(userId); // Atualizar o ranking após calcular e salvar os pontos
    }

    async function calcularESalvarPontos(userId, rodada, palpites, resultados, pontosTotaisContainer, pontosRodadaContainer) {
        let totalPontos = 0;
        palpites.forEach(palpite => {
            const resultado = resultados.find(r => r.jogo_id === palpite.jogo);
            if (resultado) {
                totalPontos += calcularPontos(
                    { mandante: palpite.palpite_mandante, visitante: palpite.palpite_visitante },
                    { mandante: resultado.mandante_gols, visitante: resultado.visitante_gols },
                    palpite.primeiro_gol, resultado.primeiro_gol, palpite.jogo_dobro
                );
            }
        });

        const pontosExistentes = await recuperarPontos(userId);
        const pontosRodadaExistente = pontosExistentes.find(p => p.rodada === rodada);

        if (!pontosRodadaExistente && totalPontos > 0) {
            await salvarPontos(userId, rodada, totalPontos);
        }

        const pontosAtualizados = await recuperarPontos(userId);
        atualizarListaPontos(pontosAtualizados, pontosTotaisContainer, pontosRodadaContainer);
    }

    function atualizarListaPalpites(palpites, betsList) {
        betsList.innerHTML = '';
        palpites.forEach(palpite => {
            const li = document.createElement('li');
            li.textContent = `Rodada ${palpite.rodada}, Jogo ${palpite.jogo}: ${palpite.palpite_mandante} x ${palpite.palpite_visitante}, Primeiro Gol: ${palpite.primeiro_gol}, Jogo em Dobro: ${palpite.jogo_dobro ? '⚽' : ''}`;
            betsList.appendChild(li);
        });
    }

    function atualizarListaPontos(pontos, pontosTotaisContainer, pontosRodadaContainer) {
        pontosTotaisContainer.innerHTML = '';
        pontosRodadaContainer.innerHTML = '';

        let totalPontos = 0;
        pontos.forEach(ponto => {
            totalPontos += ponto.pontos;
            const liRodada = document.createElement('li');
            liRodada.textContent = `Rodada ${ponto.rodada}: ${ponto.pontos} pontos`;
            pontosRodadaContainer.appendChild(liRodada);
        });

        const liTotal = document.createElement('li');
        liTotal.textContent = `Total: ${totalPontos} pontos`;
        pontosTotaisContainer.appendChild(liTotal);
    }

    btnRanking.addEventListener('click', async () => {
        const { data: ranking, error } = await supabase
            .from('ranking')
            .select('username, total_pontos')
            .order('total_pontos', { ascending: false });

        if (error) {
            console.error('Erro ao buscar o ranking:', error);
            return;
        }

        rankingList.innerHTML = '';
        ranking.forEach((user, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${user.username}: ${user.total_pontos} pontos`;
            rankingList.appendChild(li);
        });
    });
});