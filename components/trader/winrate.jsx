import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import { useThemeMode } from "../../shared/themedefault";

export default function WinRateCalculator() {
  const [entradas, setEntradas] = useState(100);
  const [greens, setGreens] = useState(55);
  const [odd, setOdd] = useState(2);
  const [comissao, setComissao] = useState(0); // NOVO

  const [winrate, setWinrate] = useState(null);
  const [bep, setBep] = useState(null);
  const [ev, setEv] = useState(null);
  const [oddMinima, setOddMinima] = useState(null);

  const { darkMode, toggleDarkMode } = useThemeMode();

  const calcular = () => {
    if (
      entradas <= 0 ||
      greens < 0 ||
      greens > entradas ||
      odd < 1.01 ||
      comissao < 0 ||
      comissao > 100
    ) {
      alert("Preencha os campos corretamente.");
      return;
    }

    const winrateCalc = (greens / entradas) * 100;
    const lucroPorGreen = (odd - 1) * (1 - comissao / 100);
    const bepCalc = (1 / lucroPorGreen) * 100;
    const evCalc = winrateCalc - bepCalc;
    const oddMinCalc = 100 / (winrateCalc * (1 - comissao / 100)) + 1;

    setWinrate(winrateCalc.toFixed(2));
    setBep(bepCalc.toFixed(2));
    setEv(evCalc.toFixed(2));
    setOddMinima(oddMinCalc.toFixed(2));
  };

  const resetar = () => {
    setEntradas(100);
    setGreens(55);
    setOdd(2);
    setComissao(0);
    setWinrate(null);
    setBep(null);
    setEv(null);
    setOddMinima(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label={darkMode ? "Modo Escuro" : "Modo Claro"}
        sx={{ mb: 2 }}
      />

      <Card elevation={6}>
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Total de Entradas"
              type="number"
              value={entradas}
              onChange={(e) => setEntradas(Number(e.target.value))}
              inputProps={{ min: 1 }}
              fullWidth
            />

            <TextField
              label="Total de Greens"
              type="number"
              value={greens}
              onChange={(e) => setGreens(Number(e.target.value))}
              inputProps={{ min: 0, max: entradas }}
              fullWidth
            />

            <TextField
              label="Odd Média"
              type="number"
              value={odd}
              onChange={(e) => setOdd(Number(e.target.value))}
              inputProps={{ min: 1.01, step: 0.01 }}
              fullWidth
            />

            <TextField
              label="Comissão (%)"
              type="number"
              value={comissao}
              onChange={(e) => setComissao(Number(e.target.value))}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              helperText="Percentual sobre lucro dos greens"
              fullWidth
            />

            <Button variant="contained" color="secondary" onClick={calcular}>
              Calcular
            </Button>

            <Button variant="contained" color="primary" onClick={resetar}>
              Resetar
            </Button>

            {winrate !== null && (
              <Box mt={2}>
                <Typography variant="h6" align="center" color="green">
                  ✅ Winrate: {winrate}%
                </Typography>
                <Typography variant="h6" align="center">
                  🎯 BEP: {bep}%
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  color={ev >= 0 ? "green" : "red"}
                >
                  📈 EV: {ev}%
                </Typography>
                <Typography variant="h6" align="center">
                  🔢 Odd Mínima: {oddMinima}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
