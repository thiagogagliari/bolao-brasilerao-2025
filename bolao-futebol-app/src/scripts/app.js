import {
  salvarPalpite,
  recuperarPalpites,
  recuperarResultados,
  salvarPontos,
  recuperarPontos,
  calcularPontos,
  atualizarRanking,
} from "./bolao.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://rkdwkfiydsicrrxthvfp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHdrZml5ZHNpY3JyeHRodmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTAzNTQsImV4cCI6MjA1ODA2NjM1NH0.y6uiqTfzKSA7WJZkCuykObYQtbdfHiRhDI-xkQdYbDk";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("palpite-form");
  const betsList = document.getElementById("lista-palpites");
  const jogosContainer = document.getElementById("jogos-container");
  const pontosTotaisContainer = document.getElementById("pontos-totais");
  const pontosRodadaContainer = document.getElementById("pontos-rodada");
  const userInfo = document.getElementById("user-info");
  const btnRanking = document.getElementById("btn-ranking");
  const rankingList = document.getElementById("ranking-list");
  const mensagem = document.getElementById("mensagem");
  const btnEnviar = document.getElementById("btn-enviar"); // Certifique-se de que o ID está correto

  const prazoFinal = new Date(2025, 3, 26, 16, 0); // 26 de abril de 2025 às 16:00 (mês começa em 0)

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error("Erro ao buscar a sessão:", error);
    alert("Erro ao buscar a sessão.");
    window.location.href = "login.html";
    return;
  }

  if (!session) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
    return;
  }

  const user = session.user;

  // Buscar o nome do usuário na tabela user_profiles
  const { data: userProfile, error: userProfileError } = await supabase
    .from("user_profiles")
    .select("username")
    .eq("user_id", user.id)
    .single();

  if (userProfileError) {
    console.error("Erro ao buscar o perfil do usuário:", userProfileError);
    userInfo.innerHTML = "Bem-vindo, Usuário";
  } else {
    console.log("Perfil do usuário:", userProfile);
    userInfo.innerHTML = `Bem-vindo, ${userProfile.username} <button id="logout-button" style="background-color: red; color: white; border: none; padding: 5px 10px; cursor: pointer;">Logout</button>`;
  }

  document
    .getElementById("logout-button")
    .addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "login.html";
    });

  const userId = user.id;
  let rodada = 6;

  const jogosRodada1 = [
    {
      id: 1,
      mandante: "CRU",
      visitante: "MIR",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "29/03/2025",
      horario: "18:30",
    },
    {
      id: 2,
      mandante: "FOR",
      visitante: "FLU",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/fluminense.png",
      data: "29/03/2025",
      horario: "18:30",
    },
    {
      id: 3,
      mandante: "GRE",
      visitante: "CAM",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "29/03/2025",
      horario: "18:30",
    },
    {
      id: 4,
      mandante: "JUV",
      visitante: "VIT",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/vitoria.png",
      data: "29/03/2025",
      horario: "18:30",
    },
    {
      id: 5,
      mandante: "SÃO",
      visitante: "SPO",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/sport.svg",
      data: "29/03/2025",
      horario: "18:30",
    },
    {
      id: 6,
      mandante: "FLA",
      visitante: "INT",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/internacional.png",
      data: "29/03/2025",
      horario: "21:00",
    },
    {
      id: 7,
      mandante: "PAL",
      visitante: "BOT",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "30/03/2025",
      horario: "16:00",
    },
    {
      id: 8,
      mandante: "VAS",
      visitante: "SAN",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/santos.png",
      data: "30/03/2025",
      horario: "18:30",
    },
    {
      id: 9,
      mandante: "BAH",
      visitante: "COR",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "30/04/2025",
      horario: "20:00",
    },
    {
      id: 10,
      mandante: "BRA",
      visitante: "CEA",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/ceara.png",
      data: "31/04/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada2 = [
    {
      id: 11,
      mandante: "CEA",
      visitante: "GRÊ",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/gremio.png",
      data: "05/04/2025",
      horario: "18:30",
    },
    {
      id: 12,
      mandante: "COR",
      visitante: "VAS",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/vasco.png",
      data: "05/04/2025",
      horario: "18:30",
    },
    {
      id: 13,
      mandante: "BOT",
      visitante: "JUV",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "05/04/2025",
      horario: "21:00",
    },
    {
      id: 14,
      mandante: "CAM",
      visitante: "SÃO",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "06/04/2025",
      horario: "16:00",
    },
    {
      id: 15,
      mandante: "FLU",
      visitante: "BRA",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "06/04/2025",
      horario: "16:00",
    },
    {
      id: 16,
      mandante: "INT",
      visitante: "CRU",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "06/04/2025",
      horario: "18:30",
    },
    {
      id: 17,
      mandante: "MIR",
      visitante: "FOR",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "06/04/2025",
      horario: "18:30",
    },
    {
      id: 18,
      mandante: "SPO",
      visitante: "PAL",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/palmeiras.png",
      data: "06/04/2025",
      horario: "18:30",
    },
    {
      id: 19,
      mandante: "VIT",
      visitante: "FLA",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "06/04/2025",
      horario: "18:30",
    },
    {
      id: 20,
      mandante: "SAN",
      visitante: "BAH",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/bahia.png",
      data: "06/04/2025",
      horario: "20:30",
    },
  ];

  const jogosRodada3 = [
    {
      id: 21,
      mandante: "JUV",
      visitante: "CEA",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/ceara.png",
      data: "12/04/2025",
      horario: "16:00",
    },
    {
      id: 22,
      mandante: "BRA",
      visitante: "BOT",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "12/04/2025",
      horario: "16:00",
    },
    {
      id: 23,
      mandante: "PAL",
      visitante: "COR",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "12/04/2025",
      horario: "18:30",
    },
    {
      id: 24,
      mandante: "VAS",
      visitante: "SPO",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/sport.svg",
      data: "12/04/2025",
      horario: "21:00",
    },
    {
      id: 25,
      mandante: "BAH",
      visitante: "MIR",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "13/04/2025",
      horario: "16:00",
    },
    {
      id: 26,
      mandante: "GRÊ",
      visitante: "FLA",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "13/04/2025",
      horario: "17:30",
    },
    {
      id: 27,
      mandante: "SÃO",
      visitante: "CRU",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "13/04/2025",
      horario: "17:30",
    },
    {
      id: 28,
      mandante: "FLU",
      visitante: "SAN",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/santos.png",
      data: "13/04/2025",
      horario: "19:30",
    },
    {
      id: 29,
      mandante: "FOR",
      visitante: "INT",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/internacional.png",
      data: "13/04/2025",
      horario: "20:00",
    },
    {
      id: 30,
      mandante: "CAM",
      visitante: "VIT",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "13/04/2025",
      horario: "20:30",
    },
  ];

  const jogosRodada4 = [
    {
      id: 31,
      mandante: "CEA",
      visitante: "VAS",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/vasco.png",
      data: "15/04/2025",
      horario: "21:30",
    },
    {
      id: 32,
      mandante: "BOT",
      visitante: "SÃO",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "16/04/2025",
      horario: "18:30",
    },
    {
      id: 33,
      mandante: "MIR",
      visitante: "GRÊ",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/gremio.png",
      data: "16/04/2025",
      horario: "19:00",
    },
    {
      id: 34,
      mandante: "SPO",
      visitante: "BRA",
      escudoMandante: "./assets/sport.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "16/04/2025",
      horario: "19:00",
    },
    {
      id: 35,
      mandante: "COR",
      visitante: "FLU",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "16/04/2025",
      horario: "19:30",
    },
    {
      id: 36,
      mandante: "INT",
      visitante: "PAL",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "16/04/2025",
      horario: "19:30",
    },
    {
      id: 37,
      mandante: "FLA",
      visitante: "JUV",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "16/04/2025",
      horario: "21:30",
    },
    {
      id: 38,
      mandante: "SAN",
      visitante: "CAM",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "16/04/2025",
      horario: "21:30",
    },
    {
      id: 39,
      mandante: "VIT",
      visitante: "FOR",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "16/04/2025",
      horario: "21:30",
    },
    {
      id: 40,
      mandante: "CRU",
      visitante: "BAH",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/bahia.png",
      data: "17/04/2025",
      horario: "21:30",
    },
  ];

  const jogosRodada5 = [
    {
      id: 41,
      mandante: "COR",
      visitante: "SPO",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/sport.svg",
      data: "19/04/2025",
      horario: "16:00",
    },
    {
      id: 42,
      mandante: "VAS",
      visitante: "FLA",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "19/04/2025",
      horario: "18:30",
    },
    {
      id: 43,
      mandante: "GRÊ",
      visitante: "INT",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/internacional.png",
      data: "19/04/2025",
      horario: "21:00",
    },
    {
      id: 44,
      mandante: "JUV",
      visitante: "MIR",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/mirassol.svg",
      data: "20/04/2025",
      horario: "11:00",
    },
    {
      id: 45,
      mandante: "CAM",
      visitante: "BOT",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "20/04/2025",
      horario: "16:00",
    },
    {
      id: 46,
      mandante: "SÃO",
      visitante: "SAN",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/santos.png",
      data: "20/04/2025",
      horario: "16:00",
    },
    {
      id: 47,
      mandante: "FLU",
      visitante: "VIT",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "20/04/2025",
      horario: "18:30",
    },
    {
      id: 48,
      mandante: "FOR",
      visitante: "PAL",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/palmeiras.png",
      data: "20/04/2025",
      horario: "18:30",
    },
    {
      id: 49,
      mandante: "BRA",
      visitante: "CRU",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "20/04/2025",
      horario: "20:30",
    },
    {
      id: 50,
      mandante: "BAH",
      visitante: "CEA",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/ceara.png",
      data: "21/04/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada6 = [
    {
      id: 51,
      mandante: "INT",
      visitante: "JUV",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "26/04/2025",
      horario: "16:00",
    },
    {
      id: 52,
      mandante: "CEA",
      visitante: "SÃO",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "26/04/2025",
      horario: "18:30",
    },
    {
      id: 53,
      mandante: "MIR",
      visitante: "CAM",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "26/04/2025",
      horario: "18:30",
    },
    {
      id: 54,
      mandante: "SPO",
      visitante: "FOR",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "26/04/2025",
      horario: "20:00",
    },
    {
      id: 55,
      mandante: "BOT",
      visitante: "FLU",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "26/04/2025",
      horario: "21:00",
    },
    {
      id: 56,
      mandante: "FLA",
      visitante: "COR",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "27/04/2025",
      horario: "16:00",
    },
    {
      id: 57,
      mandante: "CRU",
      visitante: "VAS",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/vasco.png",
      data: "27/04/2025",
      horario: "18:30",
    },
    {
      id: 58,
      mandante: "PAL",
      visitante: "BAH",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/bahia.png",
      data: "27/04/2025",
      horario: "18:30",
    },
    {
      id: 59,
      mandante: "VIT",
      visitante: "GRÊ",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/gremio.png",
      data: "27/04/2025",
      horario: "18:30",
    },
    {
      id: 60,
      mandante: "SAN",
      visitante: "BRA",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "27/04/2025",
      horario: "20:30",
    },
  ];

  const jogosPorRodada = {
    1: jogosRodada1,
    2: jogosRodada2,
    3: jogosRodada3,
    4: jogosRodada4,
    5: jogosRodada5,
    6: jogosRodada6,
  };

  const rodadaSelect = document.getElementById("rodada-select");
  rodadaSelect.addEventListener("change", async (event) => {
    rodada = parseInt(event.target.value);
    await carregarJogosEResultados(rodada);
  });

  await carregarJogosEResultados(rodada);

  async function carregarJogosEResultados(rodada) {
    jogosContainer.innerHTML = "";
    const jogos = jogosPorRodada[rodada];
    const resultados = await recuperarResultados(rodada);
    const palpites = await recuperarPalpites(userId, rodada);

    jogos.forEach((jogo) => {
      const jogoDiv = document.createElement("div");
      jogoDiv.classList.add("jogo");

      const resultado = resultados.find((r) => r.jogo_id === jogo.id);
      const palpiteExistente = palpites.find((p) => p.jogo === jogo.id);

      let pontosJogo = 0;
      if (resultado && palpiteExistente) {
        pontosJogo = calcularPontos(
          {
            mandante: palpiteExistente.palpite_mandante,
            visitante: palpiteExistente.palpite_visitante,
          },
          {
            mandante: resultado.mandante_gols,
            visitante: resultado.visitante_gols,
          },
          palpiteExistente.primeiro_gol,
          resultado.primeiro_gol,
          palpiteExistente.jogo_dobro
        );
      }

      jogoDiv.innerHTML = `
         <div>
        <img src="${jogo.escudoMandante}" alt="${jogo.mandante}" class="escudo">
        <span>${jogo.mandante}</span>
        <span>vs</span>
        <span>${jogo.visitante}</span>
        <img src="${jogo.escudoVisitante}" alt="${
        jogo.visitante
      }" class="escudo">
        <span class="pontos-jogo">${pontosJogo} pontos</span>
    </div>
    <div style="margin-top: 5px; font-size: 15px; color: rgb(41,212,129);">
        <strong>Data:</strong> ${jogo.data} | <strong>Horário:</strong> ${
        jogo.horario
      }
    </div>
    ${
      palpiteExistente
        ? `
        <div style="background-color:rgb(41, 212, 129); color:black; padding: 5px; font-size:15px; margin-top: 5px; border-radius: 5px;">
            <strong>Seu Palpite:</strong> ${jogo.mandante} ${palpiteExistente.palpite_mandante} x ${palpiteExistente.palpite_visitante} ${jogo.visitante}
        </div>
    `
        : `
        <div>
            <input type="number" name="palpite-mandante-${jogo.id}" placeholder="Gols Mandante" required>
            <span>vs</span>
            <input type="number" name="palpite-visitante-${jogo.id}" placeholder="Gols Visitante" required>
            <label for="primeiro-gol-${jogo.id}">Primeiro Gol:</label>
            <select name="primeiro-gol-${jogo.id}" required>
                <option value="mandante">Mandante</option>
                <option value="nenhum">Nenhum</option>
                <option value="visitante">Visitante</option>
            </select>
            <label for="jogo-dobro-${jogo.id}">BÔNUS:</label>
            <input type="checkbox" name="jogo-dobro-${jogo.id}" class="jogo-dobro-checkbox">
        </div>
    `
    }
    ${
      resultado
        ? `
        <div style="background-color: #ffcd00; color:black; padding: 5px; font-size:15px; margin-top: 5px; border-radius: 5px;">
            <strong>Final:</strong> ${jogo.mandante} ${resultado.mandante_gols} x ${resultado.visitante_gols} ${jogo.visitante}
        </div>
    `
        : ""
    }
`;
      jogosContainer.appendChild(jogoDiv);
    });

    // Adicionar evento para permitir apenas um jogo com pontos em dobro
    const checkboxesDobro = document.querySelectorAll(".jogo-dobro-checkbox");
    checkboxesDobro.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          checkboxesDobro.forEach((cb) => {
            if (cb !== event.target) {
              cb.checked = false;
            }
          });
        }
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const agora = new Date();
      if (agora >= prazoFinal) {
        mensagem.innerHTML =
          "<span style='color: red;'>⛔ Palpites encerrados! O prazo acabou.</span>";
        return;
      }

      // Desabilitar o botão de envio
      btnEnviar.disabled = true;

      let erroEncontrado = false;

      const palpitesPromises = jogos.map(async (jogo) => {
        const palpiteMandante = document.querySelector(
          `input[name="palpite-mandante-${jogo.id}"]`
        );
        const palpiteVisitante = document.querySelector(
          `input[name="palpite-visitante-${jogo.id}"]`
        );
        const primeiroGol = document.querySelector(
          `select[name="primeiro-gol-${jogo.id}"]`
        );
        const jogoDobro = document.querySelector(
          `input[name="jogo-dobro-${jogo.id}"]`
        );

        // Limpar mensagens de erro anteriores
        palpiteMandante.classList.remove("erro");
        palpiteVisitante.classList.remove("erro");
        primeiroGol.classList.remove("erro");

        // Verificar se os campos estão preenchidos
        if (!palpiteMandante.value) {
          palpiteMandante.classList.add("erro");
          erroEncontrado = true;
        }
        if (!palpiteVisitante.value) {
          palpiteVisitante.classList.add("erro");
          erroEncontrado = true;
        }
        if (!primeiroGol.value) {
          primeiroGol.classList.add("erro");
          erroEncontrado = true;
        }

        if (erroEncontrado) {
          return;
        }

        // Verificar se já existe um jogo marcado como "jogo em dobro"
        const jogoDobroExistente = palpites.find((p) => p.jogo_dobro);
        if (jogoDobro.checked && jogoDobroExistente) {
          alert('Você só pode marcar um jogo como "jogo em dobro" por rodada.');
          return;
        }

        const palpiteExistente = palpites.find((p) => p.jogo === jogo.id);
        if (!palpiteExistente) {
          await salvarPalpite(
            userId,
            rodada,
            jogo.id,
            {
              mandante: +palpiteMandante.value,
              visitante: +palpiteVisitante.value,
            },
            primeiroGol.value,
            jogoDobro.checked
          );
        }
      });

      await Promise.all(palpitesPromises);

      if (erroEncontrado) {
        mensagem.innerHTML =
          "<span style='color: red;'>⛔ Corrija os campos destacados antes de enviar.</span>";
        btnEnviar.disabled = false; // Reativar o botão se houver erros
        return;
      }

      mensagem.innerHTML =
        "<span style='color: green;'>✅ Palpite enviado com sucesso!</span>";
      const novosPalpites = await recuperarPalpites(userId, rodada);
      atualizarListaPalpites(novosPalpites, betsList);
      await calcularESalvarPontos(
        userId,
        rodada,
        novosPalpites,
        resultados,
        pontosTotaisContainer,
        pontosRodadaContainer
      );
      await atualizarRanking(userId); // Atualizar o ranking após salvar os pontos
      window.location.reload(); // Recarregar a página para atualizar os palpites e bloquear os campos
    });

    await calcularESalvarPontos(
      userId,
      rodada,
      palpites,
      resultados,
      pontosTotaisContainer,
      pontosRodadaContainer
    );
    await atualizarRanking(userId); // Atualizar o ranking após calcular e salvar os pontos
  }

  async function calcularESalvarPontos(
    userId,
    rodada,
    palpites,
    resultados,
    pontosTotaisContainer,
    pontosRodadaContainer
  ) {
    let totalPontos = 0;
    palpites.forEach((palpite) => {
      const resultado = resultados.find((r) => r.jogo_id === palpite.jogo);
      if (resultado) {
        totalPontos += calcularPontos(
          {
            mandante: palpite.palpite_mandante,
            visitante: palpite.palpite_visitante,
          },
          {
            mandante: resultado.mandante_gols,
            visitante: resultado.visitante_gols,
          },
          palpite.primeiro_gol,
          resultado.primeiro_gol,
          palpite.jogo_dobro
        );
      }
    });

    const pontosExistentes = await recuperarPontos(userId);
    const pontosRodadaExistente = pontosExistentes.find(
      (p) => p.rodada === rodada
    );

    if (!pontosRodadaExistente && totalPontos > 0) {
      await salvarPontos(userId, rodada, totalPontos);
    }

    const pontosAtualizados = await recuperarPontos(userId);
    atualizarListaPontos(
      pontosAtualizados,
      pontosTotaisContainer,
      pontosRodadaContainer
    );
  }

  function atualizarListaPalpites(palpites, betsList) {
    betsList.innerHTML = "";
    palpites.forEach((palpite) => {
      const li = document.createElement("li");
      li.textContent = `Rodada ${palpite.rodada}, Jogo ${palpite.jogo}: ${
        palpite.palpite_mandante
      } x ${palpite.palpite_visitante}, Primeiro Gol: ${
        palpite.primeiro_gol
      }, Jogo em Dobro: ${palpite.jogo_dobro ? "⚽" : ""}`;
      betsList.appendChild(li);
    });
  }

  function atualizarListaPontos(
    pontos,
    pontosTotaisContainer,
    pontosRodadaContainer
  ) {
    pontosTotaisContainer.innerHTML = "";
    pontosRodadaContainer.innerHTML = "";

    let totalPontos = 0;
    pontos.forEach((ponto) => {
      totalPontos += ponto.pontos;
      const liRodada = document.createElement("li");
      liRodada.textContent = `Rodada ${ponto.rodada}: ${ponto.pontos} pontos`;
      pontosRodadaContainer.appendChild(liRodada);
    });

    const liTotal = document.createElement("li");
    liTotal.textContent = `Total: ${totalPontos} pontos`;
    pontosTotaisContainer.appendChild(liTotal);
  }

  btnRanking.addEventListener("click", async () => {
    const { data: ranking, error } = await supabase
      .from("ranking")
      .select("username, total_pontos")
      .order("total_pontos", { ascending: false });

    if (error) {
      console.error("Erro ao buscar o ranking:", error);
      return;
    }

    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "";

    ranking.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.total_pontos}</td>
        `;
      rankingList.appendChild(row);
    });
  });
});
