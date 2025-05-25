import {
  Container,
  Typography,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  Link,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { useThemeMode } from "../../shared/themedefault";

export default function Contact() {
  const { darkMode, toggleDarkMode } = useThemeMode();
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
        label={darkMode ? "Modo Escuro" : "Modo Claro"}
        sx={{ mb: 2 }}
      />
      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        Entre em contato comigo pelas redes sociais ou envie um e-mail para
        sugestões de melhorias ou novas funcionalidades.
      </Typography>

      <Stack spacing={3} direction="row" justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<LinkedInIcon />}
          component={Link}
          href="https://www.linkedin.com/in/maykon-emanuel-8764b5103/"
          target="_blank"
          rel="noopener"
          sx={{
            borderColor: "#0A66C2",
            color: "#0A66C2",
            "&:hover": {
              backgroundColor: "#0A66C2",
              color: "#fff",
              borderColor: "#0A66C2",
            },
          }}
        >
          LinkedIn
        </Button>

        <Button
          variant="outlined"
          startIcon={<EmailIcon />}
          component={Link}
          href="mailto:maykonsoftwares@gmail.com"
          sx={{
            borderColor: "#6f42c1",
            color: "#6f42c1",
            "&:hover": {
              backgroundColor: "#6f42c1",
              color: "#fff",
              borderColor: "#6f42c1",
            },
          }}
        >
          Enviar Email
        </Button>
      </Stack>
      <Typography
        variant="caption"
        sx={{ display: "block", mt: 4, color: "text.secondary" }}
      >
        Trader Tab 2025 © Maykon Emanuel
      </Typography>
    </Container>
  );
}
