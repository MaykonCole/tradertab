import {
  Box,
  Switch,
  FormControlLabel,
  Container,
  Typography,
  CardContent,
  Card,
  TextField,
  Button,
} from "@mui/material";
import { useThemeMode } from "../../shared/themedefault";
import { useEffect, useState } from "react";

export default function Drakito() {
  const { darkMode, toggleDarkMode } = useThemeMode();
  const [stake, setStake] = useState(100);
  const [oddAtual, setOddAtual] = useState(8);
  const [oddAntesGol, setOddAntesGol] = useState(4);
  const [lucro, setLucro] = useState(null);
  const [prejuizo, setPrejuizo] = useState(null);
  const [relacao, setRelacao] = useState(null);

  function realizarCalculos(stake, oddAtual, oddAntesGol) {
    calcularPossivelRed(stake, oddAtual, oddAntesGol);
    calcularLucroMaximoLay(stake, oddAtual);
  }

  function calcularPossivelRed(stake, oddAtual, oddAntesGol) {
    if (stake <= 0 || oddAtual <= 1 || oddAntesGol <= 1) return 0;

    const valorCashOut = (stake * (oddAntesGol - 1)) / (oddAtual - 1);
    const red = stake - valorCashOut;

    setPrejuizo(Number(red.toFixed(2)));
  }

  function calcularLucroMaximoLay(responsabilidade, odd) {
    if (responsabilidade <= 0 || odd <= 1) return 0;
    const stake = responsabilidade / (odd - 1);
    setLucro(Number(stake.toFixed(2)));
  }

  const resetarCampos = () => {
    setOddAntesGol(4);
    setOddAtual(8);
    setStake(100);
    setLucro(null);
    setPrejuizo(null);
    setRelacao(null);
  };

  useEffect(() => {
    if (lucro !== null && prejuizo !== null) {
      const relacao = Number((prejuizo / lucro).toFixed(2));
      setRelacao(relacao);
    }
  }, [lucro, prejuizo]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label={darkMode ? "Modo Escuro" : "Modo Claro"}
        sx={{ mb: 2 }}
      />

      <Card sx={{ mt: 2 }} elevation={6}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Possível Lucro e Prejuízo
          </Typography>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Stake"
              type="number"
              inputProps={{ min: 1, step: 1 }}
              value={stake}
              onChange={(e) => {
                const value = e.target.value;
                setStake(value === "" ? 100 : Number(value));
              }}
              fullWidth
              sx={inputStyles}
            />

            <TextField
              label="Odd Atual"
              type="number"
              inputProps={{ min: 1, step: 0.01 }}
              value={oddAtual}
              onChange={(e) => {
                const value = e.target.value;
                setOddAtual(value === "" ? 8 : Number(value));
              }}
              fullWidth
              sx={inputStyles}
            />

            <TextField
              label="Odd antes do gol"
              type="number"
              inputProps={{ min: 1, step: 0.01 }}
              value={oddAntesGol}
              onChange={(e) => {
                const value = e.target.value;
                setOddAntesGol(value === "" ? 4 : Number(value));
              }}
              fullWidth
              sx={inputStyles}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={() => realizarCalculos(stake, oddAtual, oddAntesGol)}
            >
              Calcular
            </Button>

            <Button variant="contained" color="primary" onClick={resetarCampos}>
              Valores Padrão
            </Button>

            {lucro !== null && (
              <Typography variant="h6" align="center" color="green">
                Lucro : {lucro} R$
              </Typography>
            )}

            {prejuizo !== null && (
              <Typography variant="h6" align="center" color="red">
                Prejuizo : {prejuizo} R$
              </Typography>
            )}

            {relacao !== null && (
              <Typography
                variant="h6"
                align="center"
                color={darkMode ? "white" : "black"}
              >
                Relação : {relacao} greens para cobrir 1 red
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

const inputStyles = {
  "& label.Mui-focused": {
    color: "green",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "green",
    },
    "&.Mui-focused fieldset": {
      borderColor: "green",
    },
  },
};
