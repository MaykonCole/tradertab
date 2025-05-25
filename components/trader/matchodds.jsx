import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Stack,
  Paper,
  Container,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useThemeMode } from "../../shared/themedefault";

const estatisticasIniciais = [
  { nome: "Posse Ofensiva", xg: 0.02 },
  { nome: "Chute no Gol", xg: 0.3 },
  { nome: "Chute para Fora", xg: 0.04 },
  { nome: "Lançamento na Área", xg: 0.04 },
  { nome: "Infiltração na Área", xg: 0.08 },
  { nome: "Falta Lateral", xg: 0.08 },
  { nome: "Falta Frontal", xg: 0.15 },
];

export default function EstatisticasFutebol() {
  const inicialContagem = estatisticasIniciais.reduce((acc, stat) => {
    acc[stat.nome] = { favorito: 0, zebra: 0 };
    return acc;
  }, {});

  const [contagem, setContagem] = useState(inicialContagem);
  const { darkMode, toggleDarkMode } = useThemeMode();

  const [tempo, setTempo] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  useEffect(() => {
    let timer;
    if (cronometroAtivo) {
      timer = setInterval(() => {
        setTempo((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cronometroAtivo]);

  const calculaXGTotal = (time) => {
    return estatisticasIniciais.reduce((total, stat) => {
      const count = contagem[stat.nome][time];
      return total + count * stat.xg;
    }, 0);
  };

  const totalFavorito = Math.min(2, calculaXGTotal("favorito"));
  const totalZebra = Math.min(2, calculaXGTotal("zebra"));

  const handleChange = (nomeEstatistica, time, delta) => {
    setContagem((prev) => {
      const atual = prev[nomeEstatistica][time];
      const novo = Math.max(0, atual + delta);
      return {
        ...prev,
        [nomeEstatistica]: {
          ...prev[nomeEstatistica],
          [time]: novo,
        },
      };
    });
  };

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    const seg = (segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${seg}`;
  };

  const entrarNoMercado = () => {
    setCronometroAtivo(true);
  };

  const limpar = () => {
    setContagem(inicialContagem);
    setCronometroAtivo(false);
    setTempo(0);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label={darkMode ? "Modo Escuro" : "Modo Claro"}
        sx={{ mb: 2 }}
      />

      {cronometroAtivo && (
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          {formatarTempo(tempo)}
        </Typography>
      )}

      <Box sx={{ maxWidth: 700, mx: "auto", p: 2 }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Box sx={{ width: "48%" }}>
            <Typography variant="subtitle1" color="green" fontWeight="bold">
              Favorito: {totalFavorito.toFixed(2)} xG
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (totalFavorito / 2) * 100)}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#d0f0c0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "green",
                },
              }}
            />
          </Box>
          <Box sx={{ width: "48%" }}>
            <Typography
              variant="subtitle1"
              color="red"
              fontWeight="bold"
              textAlign="right"
            >
              Zebra: {totalZebra.toFixed(2)} xG
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, (totalZebra / 2) * 100)}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#f8d7da",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "red",
                },
              }}
            />
          </Box>
        </Stack>

        {estatisticasIniciais.map(({ nome }) => (
          <Paper
            key={nome}
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              mb: 1,
            }}
          >
            {/* Bloco Favorito */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 110,
              }}
            >
              <Button
                variant="contained"
                size="small"
                color="info"
                onClick={() => handleChange(nome, "favorito", -1)}
              >
                -
              </Button>
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => handleChange(nome, "favorito", 1)}
              >
                +
              </Button>
              <Typography width={24} textAlign="center">
                {contagem[nome].favorito}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: 110,
              }}
            >
              <Typography sx={{ flexGrow: 1, textAlign: "center" }}>
                {nome}
              </Typography>
            </Box>

            {/* Bloco Zebra */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: 110,
              }}
            >
              <Typography width={24} textAlign="center" mr={0.5}>
                {contagem[nome].zebra}
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => handleChange(nome, "zebra", 1)}
                sx={{ mr: 0.5 }}
              >
                +
              </Button>
              <Button
                variant="contained"
                size="small"
                color="info"
                onClick={() => handleChange(nome, "zebra", -1)}
              >
                -
              </Button>
            </Box>
          </Paper>
        ))}

        <Button
          variant="contained"
          color="secondary"
          onClick={entrarNoMercado}
          fullWidth
          sx={{ marginBottom: "12px", marginTop: "12px" }}
        >
          Entrar no Mercado
        </Button>

        <Button variant="contained" color="primary" fullWidth onClick={limpar}>
          Limpar
        </Button>
      </Box>
    </Container>
  );
}
