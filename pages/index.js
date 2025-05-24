import { AppBar, Container, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Under from "../components/trader/under";
import Drakito from "../components/trader/drakito";
import MatchOdds from "../components/trader/matchodds";
import ThemeDefault from "../shared/themedefault";

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_, newValue) => setTabIndex(newValue);

  return (
    <ThemeDefault>
      <AppBar position="static" sx={{ backgroundColor: "green" }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          centered
        >
          <Tab label="Under" />
          <Tab label="Team Winning" />
          <Tab label="MatchOdds" />
        </Tabs>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <div hidden={tabIndex !== 0}>
          <Under />
        </div>
        <div hidden={tabIndex !== 1}>
          <Drakito />
        </div>
        <div hidden={tabIndex !== 2}>
          <MatchOdds />
        </div>
      </Container>
    </ThemeDefault>
  );
}
