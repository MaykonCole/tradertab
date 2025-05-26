import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useThemeMode } from "../../shared/themedefault";

export default function Under() {
  const [odd, setOdd] = useState(4); // valor padrão fixo
  const [minuto, setMinuto] = useState(45); // valor padrão fixo
  const [lucroPorMinuto, setLucroPorMinuto] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [tipoJogo, setTipoJogo] = useState(0);
  const [tentouCalcular, setTentouCalcular] = useState(false);

  const [favorito, onChangeFavorito] = useState(0);
  const [zebra, onChangeZebra] = useState(0);

  const { darkMode, toggleDarkMode } = useThemeMode();

  // Carregar do sessionStorage apenas no cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistorico = sessionStorage.getItem("lucroHistorico");
      if (storedHistorico) setHistorico(JSON.parse(storedHistorico));

      const storedOdd = sessionStorage.getItem("odd");
      if (storedOdd) setOdd(Number(storedOdd));

      const storedMinuto = sessionStorage.getItem("minuto");
      if (storedMinuto) setMinuto(Number(storedMinuto));
    }
  }, []);

  // Salvar no sessionStorage quando mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lucroHistorico", JSON.stringify(historico));
    }
  }, [historico]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("odd", odd.toString());
    }
  }, [odd]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("minuto", minuto.toString());
    }
  }, [minuto]);

  const calcularLucro = () => {
    setTentouCalcular(true);

    if (tipoJogo === 0) {
      return;
    }

    if (odd > 1 && minuto >= 0 && minuto < 90) {
      const golsTotal = favorito + zebra;
      const minutosRestantes = 90 - minuto;
      const oddFinal = 1.01;
      const lucroTotal = odd - oddFinal;
      const fatorGol = Math.max(1 - golsTotal * 0.1, 0.5);

      const percentualPorJogo = tipoJogo / 2;

      const valorBruto = (lucroTotal / minutosRestantes) * 100;
      console.log(valorBruto);

      const resultado =
        ((lucroTotal * fatorGol) / minutosRestantes) * 100 + percentualPorJogo;

      const lucro = Number(resultado.toFixed(2));

      setLucroPorMinuto(lucro);
      setHistorico([{ odd, minuto, lucroPorMinuto: lucro }, ...historico]);
    } else {
      setLucroPorMinuto(null);
    }
  };

  const resetarCampos = () => {
    setOdd(2);
    setMinuto(45);
    setLucroPorMinuto(null);
    setHistorico([]);
    setTipoJogo(0);
    setTentouCalcular(false);
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  };

  const isError = tentouCalcular && tipoJogo === 0;

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
            Lucro por Minuto
          </Typography>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Odd Atual do Under Limite"
              type="number"
              inputProps={{ min: 1, step: 0.01 }}
              value={odd}
              onChange={(e) => {
                const value = e.target.value;
                setOdd(value === "" ? 2 : Number(value));
              }}
              fullWidth
              sx={{
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
              }}
            />

            <TextField
              label="Minuto de Jogo"
              type="number"
              inputProps={{ min: 1, max: 130, step: 3 }}
              value={minuto}
              onChange={(e) => {
                const value = e.target.value;
                setMinuto(value === "" ? 1 : Number(value));
              }}
              fullWidth
              sx={{
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
              }}
            />

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <Typography
                variant="body1"
                sx={{ color: "green", fontWeight: "bold", fontSize: "20px" }}
              >
                Casa
              </Typography>
              <TextField
                type="number"
                size="small"
                value={favorito}
                onChange={(e) => onChangeFavorito(Number(e.target.value))}
                inputProps={{ min: 0 }}
                sx={{ width: 60 }}
              />

              <Typography variant="h6">x</Typography>

              <TextField
                type="number"
                size="small"
                value={zebra}
                onChange={(e) => onChangeZebra(Number(e.target.value))}
                inputProps={{ min: 0 }}
                sx={{ width: 60 }}
              />
              <Typography
                variant="body1"
                sx={{ color: "red", fontWeight: "bold", fontSize: "20px" }}
              >
                Fora
              </Typography>
            </Box>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Tipo de Jogo
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tipoJogo}
                label="Tipo de Jogo"
                onChange={(e) => setTipoJogo(e.target.value)}
              >
                <MenuItem value={0}>
                  <em>Selecione...</em>
                </MenuItem>
                <MenuItem value={4}>
                  Jogo truncado (muitas faltas, cera)
                </MenuItem>
                <MenuItem value={3}>
                  Somente um time atacando (só chuveirinho)
                </MenuItem>
                <MenuItem value={2}>
                  Somente um time atacando (com chances)
                </MenuItem>
                <MenuItem value={1}>
                  Ambos times atacando (jogo aberto)
                </MenuItem>
              </Select>
              {isError && (
                <FormHelperText
                  sx={{ color: "red", fontWeight: "bold", fontSize: "15px" }}
                >
                  Por favor, selecione o tipo de jogo.
                </FormHelperText>
              )}
            </FormControl>

            <Button
              variant="contained"
              color="secondary"
              onClick={calcularLucro}
            >
              Calcular
            </Button>

            <Button variant="contained" color="primary" onClick={resetarCampos}>
              Valores Padrão
            </Button>

            {lucroPorMinuto !== null && (
              <Typography variant="h6" align="center" color="green">
                Lucro por minuto: {lucroPorMinuto}%
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {historico.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Histórico
            </Typography>
            {historico.map((item, index) => (
              <Typography key={index} variant="body2">
                Odd: {item.odd}, Minuto: {item.minuto}, Lucro/min:{" "}
                {item.lucroPorMinuto}%
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
