import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Checkbox,
  Button,
  LinearProgress,
} from "@mui/material";

import { useThemeMode } from "../../shared/themedefault";

export default function LucroPorMinuto() {
  const { darkMode, toggleDarkMode } = useThemeMode();

  const favoritoLabels = [
    { label: "Marcação Pressão", peso: 20 },
    { label: "Posse de Bola Ofensiva", peso: 20 },
    { label: "Infiltração na Área", peso: 20 },
    { label: "Recuperação de bola", peso: 20 },
    { label: "Chegando à linha de fundo", peso: 20 },
  ];

  const zebraLabels = [
    { label: "Com espaço para atacar", peso: -15 },
    { label: "Criando bolas paradas", peso: -22 },
    { label: "Tendo finalizações", peso: -25 },
    { label: "Marcação alta", peso: -20 },
    { label: "Chegando no último terço", peso: -18 },
  ];

  const [favoritoChecks, setFavoritoChecks] = useState(
    Array(favoritoLabels.length).fill(false),
  );
  const [zebraChecks, setZebraChecks] = useState(
    Array(zebraLabels.length).fill(false),
  );

  const handleFavoritoChange = (index: number) => {
    const newState = [...favoritoChecks];
    newState[index] = !newState[index];
    setFavoritoChecks(newState);
  };

  const handleZebraChange = (index: number) => {
    const newState = [...zebraChecks];
    newState[index] = !newState[index];
    setZebraChecks(newState);
  };

  const handleReset = () => {
    setFavoritoChecks(Array(favoritoLabels.length).fill(false));
    setZebraChecks(Array(zebraLabels.length).fill(false));
  };

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

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60)
      .toString()
      .padStart(2, "0");
    const seg = (segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${seg}`;
  };

  const toggleMercado = () => {
    if (cronometroAtivo) {
      setCronometroAtivo(false);
      setTempo(0);
    } else {
      setCronometroAtivo(true);
    }
  };

  const progresso = useMemo(() => {
    const favoritoPeso = favoritoChecks
      .map((checked, index) => (checked ? favoritoLabels[index].peso : 0))
      .reduce((acc, val) => acc + val, 0);

    const zebraPeso = zebraChecks
      .map((checked, index) => (checked ? zebraLabels[index].peso : 0))
      .reduce((acc, val) => acc + val, 0);

    const total = favoritoPeso + zebraPeso;
    const totalLimitado = Math.max(0, Math.min(total, 100)); // Limita entre 0 e 100

    return totalLimitado;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritoChecks, zebraChecks]);

  const progressColor = useMemo(() => {
    const startColor = [200, 255, 200]; // Verde claro
    const endColor = [0, 128, 0]; // Verde escuro

    const ratio = progresso / 100;

    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  }, [progresso]);

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

      <Card sx={{ mt: 2 }} elevation={6}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              mb: 2,
            }}
          >
            {/* Grupo Favorito */}
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "20px",
                  mb: 1,
                }}
              >
                Favorito
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                {favoritoLabels.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Checkbox
                      checked={favoritoChecks[index]}
                      onChange={() => handleFavoritoChange(index)}
                      sx={{
                        color: "green",
                        "&.Mui-checked": { color: "green" },
                      }}
                    />
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Grupo Zebra */}
            <Box sx={{ textAlign: "center", flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "red",
                  fontWeight: "bold",
                  fontSize: "20px",
                  mb: 1,
                }}
              >
                Zebra
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                {zebraLabels.map((item, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Checkbox
                      checked={zebraChecks[index]}
                      onChange={() => handleZebraChange(index)}
                      sx={{
                        color: "red",
                        "&.Mui-checked": { color: "red" },
                      }}
                    />
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Barra de Progresso */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progresso}
              sx={{
                height: "20px",
                borderRadius: "10px",
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: progressColor,
                  transition: "background-color 0.3s ease",
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 0.5, fontWeight: "bold" }}
            >
              {progresso}%
            </Typography>
          </Box>

          {/* Botões */}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color={cronometroAtivo ? "error" : "secondary"}
              onClick={toggleMercado}
              fullWidth
            >
              {cronometroAtivo ? "Sair do Mercado" : "Entrar no Mercado"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleReset}
            >
              Desmarcar todos checks
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
