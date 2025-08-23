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

  const prazoFinal = new Date(2025, 7, 23, 16, 0); // 23 de agosto de 2025 às 16:00 (mês começa em 0)

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
  let rodada = 21;

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
      data: "30/03/2025",
      horario: "20:00",
    },
    {
      id: 10,
      mandante: "BRA",
      visitante: "CEA",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/ceara.png",
      data: "30/03/2025",
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

  const jogosRodada7 = [
    {
      id: 61,
      mandante: "SÃO",
      visitante: "FOR",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "02/05/2025",
      horario: "21:30",
    },
    {
      id: 62,
      mandante: "CEA",
      visitante: "VIT",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "03/05/2025",
      horario: "18:30",
    },
    {
      id: 63,
      mandante: "COR",
      visitante: "INT",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/internacional.png",
      data: "03/05/2025",
      horario: "18:30",
    },
    {
      id: 64,
      mandante: "FLU",
      visitante: "SPO",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/sport.svg",
      data: "03/05/2025",
      horario: "18:30",
    },
    {
      id: 65,
      mandante: "BAH",
      visitante: "BOT",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "03/05/2025",
      horario: "21:00",
    },
    {
      id: 66,
      mandante: "GRÊ",
      visitante: "SAN",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/santos.png",
      data: "04/05/2025",
      horario: "16:00",
    },
    {
      id: 67,
      mandante: "VAS",
      visitante: "PAL",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "04/05/2025",
      horario: "16:00",
    },
    {
      id: 68,
      mandante: "CRU",
      visitante: "FLA",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "04/05/2025",
      horario: "18:30",
    },
    {
      id: 69,
      mandante: "BRA",
      visitante: "MIR",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "05/05/2025",
      horario: "19:00",
    },
    {
      id: 70,
      mandante: "JUV",
      visitante: "CAM",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "05/05/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada8 = [
    {
      id: 71,
      mandante: "FOR",
      visitante: "JUV",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/juventude.svg",
      data: "10/05/2025",
      horario: "16:00",
    },
    {
      id: 72,
      mandante: "GRÊ",
      visitante: "BRA",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "10/05/2025",
      horario: "18:30",
    },
    {
      id: 73,
      mandante: "MIR",
      visitante: "COR",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/corinthians.png",
      data: "10/05/2025",
      horario: "18:30",
    },
    {
      id: 74,
      mandante: "VIT",
      visitante: "VAS",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/vasco.png",
      data: "10/05/2025",
      horario: "18:30",
    },
    {
      id: 75,
      mandante: "FLA",
      visitante: "BAH",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/bahia.png",
      data: "10/05/2025",
      horario: "21:00",
    },
    {
      id: 76,
      mandante: "SPO",
      visitante: "CRU",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "11/05/2025",
      horario: "16:00",
    },
    {
      id: 77,
      mandante: "CAM",
      visitante: "FLU",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "11/05/2025",
      horario: "17:30",
    },
    {
      id: 78,
      mandante: "PAL",
      visitante: "SÃO",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "11/05/2025",
      horario: "17:30",
    },
    {
      id: 79,
      mandante: "BOT",
      visitante: "INT",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/internacional.png",
      data: "11/05/2025",
      horario: "20:00",
    },
    {
      id: 80,
      mandante: "SAN",
      visitante: "CEA",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/ceara.png",
      data: "12/05/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada9 = [
    {
      id: 81,
      mandante: "CEA",
      visitante: "SPO",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/sport.svg",
      data: "17/05/2025",
      horario: "16:00",
    },
    {
      id: 82,
      mandante: "VAS",
      visitante: "FOR",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "17/05/2025",
      horario: "18:30",
    },
    {
      id: 83,
      mandante: "SÃO",
      visitante: "GRÊ",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/gremio.png",
      data: "17/05/2025",
      horario: "21:00",
    },
    {
      id: 84,
      mandante: "BAH",
      visitante: "VIT",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "18/05/2025",
      horario: "16:00",
    },
    {
      id: 85,
      mandante: "COR",
      visitante: "SAN",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/santos.png",
      data: "18/05/2025",
      horario: "16:00",
    },
    {
      id: 86,
      mandante: "JUV",
      visitante: "FLU",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/fluminense.png",
      data: "18/05/2025",
      horario: "16:00",
    },
    {
      id: 87,
      mandante: "FLA",
      visitante: "BOT",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "18/05/2025",
      horario: "18:30",
    },
    {
      id: 88,
      mandante: "BRA",
      visitante: "PAL",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "18/05/2025",
      horario: "18:30",
    },
    {
      id: 89,
      mandante: "CRU",
      visitante: "CAM",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "18/05/2025",
      horario: "20:30",
    },
    {
      id: 90,
      mandante: "INT",
      visitante: "MIR",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "18/05/2025",
      horario: "20:30",
    },
  ];

  const jogosRodada10 = [
    {
      id: 91,
      mandante: "FLU",
      visitante: "VAS",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/vasco.png",
      data: "24/05/2025",
      horario: "18:30",
    },
    {
      id: 92,
      mandante: "SÃO",
      visitante: "MIR",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "24/05/2025",
      horario: "18:30",
    },
    {
      id: 93,
      mandante: "CAM",
      visitante: "COR",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "24/05/2025",
      horario: "21:00",
    },
    {
      id: 94,
      mandante: "GRÊ",
      visitante: "BAH",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/bahia.png",
      data: "25/05/2025",
      horario: "11:00",
    },
    {
      id: 95,
      mandante: "PAL",
      visitante: "FLA",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "25/05/2025",
      horario: "16:00",
    },
    {
      id: 96,
      mandante: "SPO",
      visitante: "INT",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/internacional.png",
      data: "25/05/2025",
      horario: "16:00",
    },
    {
      id: 97,
      mandante: "VIT",
      visitante: "SAN",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/santos.png",
      data: "25/05/2025",
      horario: "18:30",
    },
    {
      id: 98,
      mandante: "FOR",
      visitante: "CRU",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "25/05/2025",
      horario: "20:30",
    },
    {
      id: 99,
      mandante: "BRA",
      visitante: "JUV",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "26/05/2025",
      horario: "20:00",
    },
    {
      id: 100,
      mandante: "BOT",
      visitante: "CEA",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/ceara.png",
      data: "04/06/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada11 = [
    {
      id: 101,
      mandante: "BAH",
      visitante: "SÃO",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "31/05/2025",
      horario: "18:30",
    },
    {
      id: 102,
      mandante: "VAS",
      visitante: "BRA",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "31/05/2025",
      horario: "21:00",
    },
    {
      id: 103,
      mandante: "MIR",
      visitante: "SPO",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/sport.svg",
      data: "01/06/2025",
      horario: "11:00",
    },
    {
      id: 104,
      mandante: "JUV",
      visitante: "GRÊ",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/gremio.png",
      data: "01/06/2025",
      horario: "16:00",
    },
    {
      id: 105,
      mandante: "SAN",
      visitante: "BOT",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "01/06/2025",
      horario: "16:00",
    },
    {
      id: 106,
      mandante: "CEA",
      visitante: "CAM",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "01/06/2025",
      horario: "18:30",
    },
    {
      id: 107,
      mandante: "COR",
      visitante: "VIT",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "01/06/2025",
      horario: "18:30",
    },
    {
      id: 108,
      mandante: "FLA",
      visitante: "FOR",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "01/06/2025",
      horario: "18:30",
    },
    {
      id: 109,
      mandante: "CRU",
      visitante: "PAL",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "01/06/2025",
      horario: "19:30",
    },
    {
      id: 110,
      mandante: "INT",
      visitante: "FLU",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "01/06/2025",
      horario: "20:30",
    },
  ];

  const jogosRodada12 = [
    {
      id: 111,
      mandante: "BOT",
      visitante: "MIR",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 112,
      mandante: "FLU",
      visitante: "CEA",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/ceara.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 113,
      mandante: "PAL",
      visitante: "JUV",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 114,
      mandante: "SPO",
      visitante: "FLA",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/flamengo.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 115,
      mandante: "BRA",
      visitante: "BAH",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/bahia.png",
      data: "12/06/2025",
      horario: "19:00",
    },
    {
      id: 116,
      mandante: "VIT",
      visitante: "CRU",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "12/06/2025",
      horario: "19:00",
    },
    {
      id: 117,
      mandante: "FOR",
      visitante: "SAN",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/santos.png",
      data: "12/06/2025",
      horario: "19:30",
    },
    {
      id: 118,
      mandante: "GRÊ",
      visitante: "COR",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "12/06/2025",
      horario: "20:00",
    },
    {
      id: 119,
      mandante: "CAM",
      visitante: "INT",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/internacional.png",
      data: "12/06/2025",
      horario: "21:30",
    },
    {
      id: 120,
      mandante: "SÃO",
      visitante: "VAS",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/vasco.png",
      data: "12/06/2025",
      horario: "21:30",
    },
  ];

  const jogosRodada13 = [
    {
      id: 121,
      mandante: "FLA",
      visitante: "SÃO",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "12/07/2025",
      horario: "16:30",
    },
    {
      id: 122,
      mandante: "INT",
      visitante: "VIT",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "12/07/2025",
      horario: "16:30",
    },
    {
      id: 123,
      mandante: "VAS",
      visitante: "BOT",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "12/07/2025",
      horario: "18:30",
    },
    {
      id: 124,
      mandante: "BAH",
      visitante: "CAM",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "12/07/2025",
      horario: "21:00",
    },
    {
      id: 125,
      mandante: "MIR",
      visitante: "FLU",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/fluminense.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 126,
      mandante: "SAN",
      visitante: "PAL",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 127,
      mandante: "COR",
      visitante: "BRA",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "13/07/2025",
      horario: "19:00",
    },
    {
      id: 128,
      mandante: "CRU",
      visitante: "GRÊ",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/gremio.png",
      data: "13/07/2025",
      horario: "20:30",
    },
    {
      id: 129,
      mandante: "FOR",
      visitante: "CEA",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/ceara.png",
      data: "13/07/2025",
      horario: "20:30",
    },
    {
      id: 130,
      mandante: "JUV",
      visitante: "SPO",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/sport.svg",
      data: "14/07/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada14 = [
    {
      id: 131,
      mandante: "CAM",
      visitante: "SPO",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/sport.svg",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 132,
      mandante: "BAH",
      visitante: "INT",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/internacional.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 133,
      mandante: "JUV",
      visitante: "VAS",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/vasco.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 134,
      mandante: "PAL",
      visitante: "MIR",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "16/07/2025",
      horario: "19:00",
    },
    {
      id: 135,
      mandante: "CEA",
      visitante: "COR",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "16/07/2025",
      horario: "19:30",
    },
    {
      id: 136,
      mandante: "SAN",
      visitante: "FLA",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "16/07/2025",
      horario: "20:00",
    },
    {
      id: 137,
      mandante: "BOT",
      visitante: "VIT",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "16/07/2025",
      horario: "21:30",
    },
    {
      id: 138,
      mandante: "BRA",
      visitante: "SÃO",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "16/07/2025",
      horario: "21:30",
    },
    {
      id: 139,
      mandante: "FLU",
      visitante: "CRU",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "17/07/2025",
      horario: "19:30",
    },
    {
      id: 140,
      mandante: "GRÊ",
      visitante: "FOR",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "29/07/2025",
      horario: "20:30",
    },
  ];

  const jogosRodada15 = [
    {
      id: 141,
      mandante: "FOR",
      visitante: "BAH",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/bahia.png",
      data: "19/07/2025",
      horario: "16:00",
    },
    {
      id: 142,
      mandante: "VAS",
      visitante: "GRÊ",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/gremio.png",
      data: "19/07/2025",
      horario: "17:30",
    },
    {
      id: 143,
      mandante: "MIR",
      visitante: "SAN",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/santos.png",
      data: "19/07/2025",
      horario: "18:30",
    },
    {
      id: 144,
      mandante: "SÃO",
      visitante: "COR",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "19/07/2025",
      horario: "21:00",
    },
    {
      id: 145,
      mandante: "INT",
      visitante: "CEA",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/ceara.png",
      data: "20/07/2025",
      horario: "11:00",
    },
    {
      id: 146,
      mandante: "CRU",
      visitante: "JUV",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "20/07/2025",
      horario: "16:00",
    },
    {
      id: 147,
      mandante: "VIT",
      visitante: "BRA",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "20/07/2025",
      horario: "16:00",
    },
    {
      id: 148,
      mandante: "PAL",
      visitante: "CAM",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "20/07/2025",
      horario: "17:30",
    },
    {
      id: 149,
      mandante: "SPO",
      visitante: "BOT",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/botafogo.png",
      data: "20/07/2025",
      horario: "17:30",
    },
    {
      id: 150,
      mandante: "FLA",
      visitante: "FLU",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "20/07/2025",
      horario: "19:30",
    },
  ];

  const jogosRodada16 = [
    {
      id: 151,
      mandante: "CAM",
      visitante: "FOR",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 152,
      mandante: "GRÊ",
      visitante: "BOT",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/botafogo.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 153,
      mandante: "VAS",
      visitante: "BAH",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/bahia.png",
      data: "ADIADO",
      horario: "ADIADO",
    },
    {
      id: 154,
      mandante: "CEA",
      visitante: "MIR",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "23/07/2025",
      horario: "19:00",
    },
    {
      id: 155,
      mandante: "FLU",
      visitante: "PAL",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "23/07/2025",
      horario: "19:00",
    },
    {
      id: 156,
      mandante: "COR",
      visitante: "CRU",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "23/07/2025",
      horario: "19:30",
    },
    {
      id: 157,
      mandante: "BRA",
      visitante: "FLA",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "23/07/2025",
      horario: "21:30",
    },
    {
      id: 158,
      mandante: "SAN",
      visitante: "INT",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/internacional.png",
      data: "23/07/2025",
      horario: "21:30",
    },
    {
      id: 159,
      mandante: "VIT",
      visitante: "SPO",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/sport.svg",
      data: "23/07/2025",
      horario: "21:30",
    },
    {
      id: 160,
      mandante: "JUV",
      visitante: "SÃO",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "24/07/2025",
      horario: "19:00",
    },
  ];

  const jogosRodada17 = [
    {
      id: 161,
      mandante: "BOT",
      visitante: "COR",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "26/07/2025",
      horario: "18:30",
    },
    {
      id: 162,
      mandante: "FOR",
      visitante: "BRA",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "26/07/2025",
      horario: "18:30",
    },
    {
      id: 163,
      mandante: "MIR",
      visitante: "VIT",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/vitoria.png",
      data: "26/07/2025",
      horario: "18:30",
    },
    {
      id: 164,
      mandante: "SPO",
      visitante: "SAN",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/santos.png",
      data: "26/07/2025",
      horario: "18:30",
    },
    {
      id: 165,
      mandante: "PAL",
      visitante: "GRÊ",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/gremio.png",
      data: "26/07/2025",
      horario: "21:00",
    },
    {
      id: 166,
      mandante: "CRU",
      visitante: "CEA",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/ceara.png",
      data: "27/07/2025",
      horario: "16:00",
    },
    {
      id: 167,
      mandante: "SÃO",
      visitante: "FLU",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "27/07/2025",
      horario: "16:00",
    },
    {
      id: 168,
      mandante: "BAH",
      visitante: "JUV",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "27/07/2025",
      horario: "18:30",
    },
    {
      id: 169,
      mandante: "INT",
      visitante: "VAS",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/vasco.png",
      data: "27/07/2025",
      horario: "18:30",
    },
    {
      id: 170,
      mandante: "FLA",
      visitante: "CAM",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "27/07/2025",
      horario: "20:30",
    },
  ];

  const jogosRodada18 = [
    {
      id: 171,
      mandante: "SPO",
      visitante: "BAH",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/bahia.png",
      data: "02/08/2025",
      horario: "16:00",
    },
    {
      id: 172,
      mandante: "MIR",
      visitante: "VAS",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/vasco.png",
      data: "02/08/2025",
      horario: "16:30",
    },
    {
      id: 173,
      mandante: "FLU",
      visitante: "GRÊ",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/gremio.png",
      data: "02/08/2025",
      horario: "21:00",
    },
    {
      id: 174,
      mandante: "BOT",
      visitante: "CRU",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "03/08/2025",
      horario: "16:00",
    },
    {
      id: 175,
      mandante: "COR",
      visitante: "FOR",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "03/08/2025",
      horario: "16:00",
    },
    {
      id: 176,
      mandante: "CAM",
      visitante: "BRA",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "03/08/2025",
      horario: "18:30",
    },
    {
      id: 177,
      mandante: "CEA",
      visitante: "FLA",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "03/08/2025",
      horario: "18:30",
    },
    {
      id: 178,
      mandante: "VIT",
      visitante: "PAL",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "03/08/2025",
      horario: "19:30",
    },
    {
      id: 179,
      mandante: "INT",
      visitante: "SÃO",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "03/08/2025",
      horario: "20:30",
    },
    {
      id: 180,
      mandante: "SAN",
      visitante: "JUV",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "04/08/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada19 = [
    {
      id: 181,
      mandante: "FLA",
      visitante: "MIR",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/mirassol.svg",
      data: "09/08/2025",
      horario: "18:30",
    },
    {
      id: 182,
      mandante: "BRA",
      visitante: "INT",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/internacional.png",
      data: "09/08/2025",
      horario: "18:30",
    },
    {
      id: 183,
      mandante: "SÃO",
      visitante: "VIT",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "09/08/2025",
      horario: "18:30",
    },
    {
      id: 184,
      mandante: "FOR",
      visitante: "BOT",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/botafogo.png",
      data: "09/08/2025",
      horario: "20:30",
    },
    {
      id: 185,
      mandante: "BAH",
      visitante: "FLU",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "09/08/2025",
      horario: "21:00",
    },
    {
      id: 186,
      mandante: "PAL",
      visitante: "CEA",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/ceara.png",
      data: "10/08/2025",
      horario: "16:00",
    },
    {
      id: 187,
      mandante: "VAS",
      visitante: "CAM",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "10/08/2025",
      horario: "16:00",
    },
    {
      id: 188,
      mandante: "CRU",
      visitante: "SAN",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/santos.png",
      data: "10/08/2025",
      horario: "18:30",
    },
    {
      id: 189,
      mandante: "GRÊ",
      visitante: "SPO",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/sport.svg",
      data: "10/08/2025",
      horario: "20:30",
    },
    {
      id: 190,
      mandante: "JUV",
      visitante: "COR",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/corinthians.png",
      data: "11/08/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada20 = [
    {
      id: 191,
      mandante: "CEA",
      visitante: "BRA",
      escudoMandante: "./assets/ceara.png",
      escudoVisitante: "./assets/rb-bragantino.png",
      data: "16/08/2025",
      horario: "16:00",
    },
    {
      id: 192,
      mandante: "FLU",
      visitante: "FOR",
      escudoMandante: "./assets/fluminense.png",
      escudoVisitante: "./assets/fortaleza.svg",
      data: "16/08/2025",
      horario: "16:00",
    },
    {
      id: 193,
      mandante: "SPO",
      visitante: "SÃO",
      escudoMandante: "./assets/sport.svg",
      escudoVisitante: "./assets/sao-paulo.png",
      data: "16/08/2025",
      horario: "18:30",
    },
    {
      id: 194,
      mandante: "VIT",
      visitante: "JUV",
      escudoMandante: "./assets/vitoria.png",
      escudoVisitante: "./assets/juventude.svg",
      data: "16/08/2025",
      horario: "18:30",
    },
    {
      id: 195,
      mandante: "COR",
      visitante: "BAH",
      escudoMandante: "./assets/corinthians.png",
      escudoVisitante: "./assets/bahia.png",
      data: "16/08/2025",
      horario: "21:00",
    },
    {
      id: 196,
      mandante: "CAM",
      visitante: "GRÊ",
      escudoMandante: "./assets/atletico-mg.png",
      escudoVisitante: "./assets/gremio.png",
      data: "17/08/2025",
      horario: "16:00",
    },
    {
      id: 197,
      mandante: "SAN",
      visitante: "VAS",
      escudoMandante: "./assets/santos.png",
      escudoVisitante: "./assets/vasco.png",
      data: "17/08/2025",
      horario: "16:00",
    },
    {
      id: 198,
      mandante: "INT",
      visitante: "FLA",
      escudoMandante: "./assets/internacional.png",
      escudoVisitante: "./assets/flamengo.png",
      data: "17/08/2025",
      horario: "18:30",
    },
    {
      id: 199,
      mandante: "BOT",
      visitante: "PAL",
      escudoMandante: "./assets/botafogo.png",
      escudoVisitante: "./assets/palmeiras.png",
      data: "17/08/2025",
      horario: "20:30",
    },
    {
      id: 200,
      mandante: "MIR",
      visitante: "CRU",
      escudoMandante: "./assets/mirassol.svg",
      escudoVisitante: "./assets/cruzeiro.png",
      data: "18/08/2025",
      horario: "20:00",
    },
  ];

  const jogosRodada21 = [
    {
      id: 201,
      mandante: "BRA",
      visitante: "FLU",
      escudoMandante: "./assets/rb-bragantino.png",
      escudoVisitante: "./assets/fluminense.png",
      data: "23/08/2025",
      horario: "16:00",
    },
    {
      id: 202,
      mandante: "CRU",
      visitante: "INT",
      escudoMandante: "./assets/cruzeiro.png",
      escudoVisitante: "./assets/internacional.png",
      data: "23/08/2025",
      horario: "18:30",
    },
    {
      id: 203,
      mandante: "GRÊ",
      visitante: "CEA",
      escudoMandante: "./assets/gremio.png",
      escudoVisitante: "./assets/ceara.png",
      data: "23/08/2025",
      horario: "21:00",
    },
    {
      id: 204,
      mandante: "BAH",
      visitante: "SAN",
      escudoMandante: "./assets/bahia.png",
      escudoVisitante: "./assets/santos.png",
      data: "24/08/2025",
      horario: "16:00",
    },
    {
      id: 205,
      mandante: "VAS",
      visitante: "COR",
      escudoMandante: "./assets/vasco.png",
      escudoVisitante: "./assets/corinthians.png",
      data: "24/08/2025",
      horario: "16:00",
    },
    {
      id: 206,
      mandante: "FOR",
      visitante: "MIR",
      escudoMandante: "./assets/fortaleza.svg",
      escudoVisitante: "./assets/mirassol.svg",
      data: "24/08/2025",
      horario: "18:30",
    },
    {
      id: 207,
      mandante: "JUV",
      visitante: "BOT",
      escudoMandante: "./assets/juventude.svg",
      escudoVisitante: "./assets/botafogo.png",
      data: "24/08/2025",
      horario: "18:30",
    },
    {
      id: 208,
      mandante: "SÃO",
      visitante: "CAM",
      escudoMandante: "./assets/sao-paulo.png",
      escudoVisitante: "./assets/atletico-mg.png",
      data: "24/08/2025",
      horario: "20:30",
    },
    {
      id: 209,
      mandante: "PAL",
      visitante: "SPO",
      escudoMandante: "./assets/palmeiras.png",
      escudoVisitante: "./assets/sport.svg",
      data: "25/08/2025",
      horario: "19:00",
    },
    {
      id: 210,
      mandante: "FLA",
      visitante: "VIT",
      escudoMandante: "./assets/flamengo.png",
      escudoVisitante: "./assets/vitoria.png",
      data: "25/08/2025",
      horario: "21:00",
    },
  ];

  const jogosPorRodada = {
    1: jogosRodada1,
    2: jogosRodada2,
    3: jogosRodada3,
    4: jogosRodada4,
    5: jogosRodada5,
    6: jogosRodada6,
    7: jogosRodada7,
    8: jogosRodada8,
    9: jogosRodada9,
    10: jogosRodada10,
    11: jogosRodada11,
    12: jogosRodada12,
    13: jogosRodada13,
    14: jogosRodada14,
    15: jogosRodada15,
    16: jogosRodada16,
    17: jogosRodada17,
    18: jogosRodada18,
    19: jogosRodada19,
    20: jogosRodada20,
    21: jogosRodada21,
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
