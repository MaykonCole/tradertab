import React, { useState } from "react";
import {
  AppBar,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";

import Under from "../components/trader/under";
import Drakito from "../components/trader/drakito";
import MatchOdds from "../components/trader/matchodds";
import Contact from "../components/trader/contact";
import ThemeDefault from "../shared/themedefault";

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:520px)");

  const tabs = ["Under", "Team Winning", "Match Odds", "Contact"];

  const handleChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  const handleDrawerItemClick = (index) => {
    setTabIndex(index);
    setDrawerOpen(false);
  };

  return (
    <ThemeDefault>
      <AppBar position="static" sx={{ backgroundColor: "green" }}>
        <Toolbar>
          {isMobile ? (
            <>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Trader Tab
              </Typography>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <List sx={{ width: 200 }}>
                  {tabs.map((label, index) => (
                    <ListItem key={label} disablePadding>
                      <ListItemButton
                        onClick={() => handleDrawerItemClick(index)}
                      >
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            </>
          ) : (
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              textColor="inherit"
              indicatorColor="secondary"
              centered
              sx={{ flexGrow: 1 }}
            >
              {tabs.map((label) => (
                <Tab key={label} label={label} />
              ))}
            </Tabs>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {tabIndex === 0 && <Under />}
        {tabIndex === 1 && <Drakito />}
        {tabIndex === 2 && <MatchOdds />}
        {tabIndex === 3 && <Contact />}
      </Container>
    </ThemeDefault>
  );
}
