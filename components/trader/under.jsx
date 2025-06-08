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
  const [odd, setOdd] = useState(4);
  const [minuto, setMinuto] = useState(45);
  const [possivelAcrescimo, setPossivelAcrescimo] = useState(0);
  const [lucroPorMinuto, setLucroPorMinuto] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [tipoJogo, setTipoJogo] = useState(0);
  const [tentouCalcular, setTentouCalcular] = useState(false);

  const [favorito, onChangeFavorito] = useState(0);
  const [zebra, onChangeZebra] = useState(0);

  const { darkMode, toggleDarkMode } = useThemeMode();
  const [modoUnder, setModoUnder] = useState(true);
  const [minutosFaltando, setMinutosFaltando] = useState(10);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistorico = sessionStorage.getItem("lucroHistorico");
      if (storedHistorico) setHistorico(JSON.parse(storedHistorico));

      const storedOdd = sessionStorage.getItem("odd");
      if (storedOdd) setOdd(Number(storedOdd));

      const storedMinuto = sessionStorage.getItem("minuto");
      if (storedMinuto) setMinuto(Number(storedMinuto));

      const storedAcrescimo = sessionStorage.getItem("acrescimo");
      if (storedAcrescimo) setPossivelAcrescimo(Number(storedAcrescimo));
    }
  }, []);

  const calcularLucro = () => {
    setTentouCalcular(true);

    if (!modoUnder && tipoJogo === 0) return;

    if (
      odd > 1 &&
      (!modoUnder ? minuto >= 0 && minuto < 90 : minutosFaltando > 0)
    ) {
      console.log("Entrou no cálculo");

      let lucro;

      if (modoUnder) {
        const lucroTotal = odd - 1;
        lucro = Number(((lucroTotal / minutosFaltando) * 100).toFixed(2));
      } else {
        const golsTotal = favorito + zebra;

        const minutosRestantes =
          (minuto >= 70 ? 90 + possivelAcrescimo : 90) - minuto;

        const oddFinal = 1.01;
        const lucroTotal = odd - oddFinal;

        const fatorGol = Math.max(1 - golsTotal * 0.1, 0.5);

        const pesoTipoJogo = 1;

        const resultado =
          ((lucroTotal * fatorGol) / minutosRestantes) * 100 + pesoTipoJogo;

        lucro = Number(resultado.toFixed(2));
      }

      setLucroPorMinuto(lucro);

      setHistorico([
        {
          odd,
          minuto: modoUnder ? minutosFaltando : minuto,
          acrescimo: !modoUnder && minuto >= 70 ? possivelAcrescimo : 0,
          lucroPorMinuto: lucro,
        },
        ...historico,
      ]);
    } else {
      setLucroPorMinuto(null);
    }
  };

  const resetarCampos = () => {
    setOdd(4);
    setMinuto(45);
    setMinutosFaltando(10);
    setPossivelAcrescimo(0);
    setLucroPorMinuto(null);
    setHistorico([]);
    setTipoJogo(0);
    setTentouCalcular(false);
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
  };

  const handleModeToggle = (event) => {
    setModoUnder(event.target.checked);
  };

  const isError = tentouCalcular && tipoJogo === 0;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label={darkMode ? "Modo Escuro" : "Modo Claro"}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={<Switch checked={modoUnder} onChange={handleModeToggle} />}
        label={modoUnder ? "Modo Minutos Faltando" : "Modo Minuto Atual"}
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
              inputProps={{
                min: 1,
                step:
                  odd >= 20
                    ? 1
                    : odd >= 10
                      ? 0.5
                      : odd >= 6
                        ? 0.2
                        : odd >= 4
                          ? 0.1
                          : odd >= 3
                            ? 0.05
                            : 0.01,
              }}
              value={odd}
              onChange={(e) =>
                setOdd(e.target.value === "" ? 2 : Number(e.target.value))
              }
              fullWidth
            />

            {modoUnder ? (
              <TextField
                label="Minutos Faltando"
                type="number"
                v
                inputProps={{ min: 1, max: 30, step: 1 }}
                value={minutosFaltando}
                onChange={(e) =>
                  setMinutosFaltando(
                    e.target.value === "" ? 1 : Number(e.target.value),
                  )
                }
                fullWidth
              />
            ) : (
              <>
                <TextField
                  label="Minuto de Jogo"
                  helperText="Após o minuto 70 terá a possibilidade de informar o possível acréscimo"
                  type="number"
                  inputProps={{ min: 1, max: 89, step: 1 }}
                  value={minuto}
                  onChange={(e) =>
                    setMinuto(
                      e.target.value === "" ? 1 : Number(e.target.value),
                    )
                  }
                  fullWidth
                />
                {minuto >= 70 && (
                  <TextField
                    label="Possível Acréscimo"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 1 }}
                    value={possivelAcrescimo}
                    onChange={(e) =>
                      setPossivelAcrescimo(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                    fullWidth
                  />
                )}

                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  justifyContent="center"
                >
                  <Typography
                    sx={{
                      color: "green",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
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
                    sx={{ color: "red", fontWeight: "bold", fontSize: "20px" }}
                  >
                    Fora
                  </Typography>
                </Box>

                <FormControl fullWidth error={isError}>
                  <InputLabel>Tipo de Jogo</InputLabel>
                  <Select
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
                      Só um time atacando (chuveirinho)
                    </MenuItem>
                    <MenuItem value={2}>
                      Só um time atacando (com chances)
                    </MenuItem>
                    <MenuItem value={1}>Ambos atacando (jogo aberto)</MenuItem>
                  </Select>
                  {!modoUnder && isError && (
                    <FormHelperText>
                      Por favor, selecione o tipo de jogo.
                    </FormHelperText>
                  )}
                </FormControl>
              </>
            )}

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
                Odd: {item.odd}, {modoUnder ? "Minutos faltando" : "Minuto"}:{" "}
                {item.minuto}, Lucro/min: {item.lucroPorMinuto}%
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
