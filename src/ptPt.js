// Portuguese (Portugal) localisation helper.
// It preserves the structure of the Brazilian Portuguese copy while converting
// common wording to natural European Portuguese so every translated key remains covered.
const replacements = [
  [/\bBuscar\b/g, "Pesquisar"],
  [/\bbuscar\b/g, "pesquisar"],
  [/\bBusca\b/g, "Pesquisa"],
  [/\bbusca\b/g, "pesquisa"],
  [/\btime\b/g, "equipa"],
  [/\bTime\b/g, "Equipa"],
  [/\btimes\b/g, "equipas"],
  [/\bTimes\b/g, "Equipas"],
  [/\bjogos encontrados\b/g, "jogos encontrados"],
  [/\bHorário\b/g, "Hora"],
  [/\bhorário\b/g, "hora"],
  [/\bhorários\b/g, "horas"],
  [/\bCadastro\b/g, "Registo"],
  [/\bcadastro\b/g, "registo"],
  [/\bcadastrar\b/g, "registar"],
  [/\bCriar conta\b/g, "Criar conta"],
  [/\bCarregando\b/g, "A carregar"],
  [/\bcarregando\b/g, "a carregar"],
  [/\bSalvando\b/g, "A guardar"],
  [/\bsalvando\b/g, "a guardar"],
  [/\bSalvar\b/g, "Guardar"],
  [/\bsalvar\b/g, "guardar"],
  [/\bSalvo\b/g, "Guardado"],
  [/\bsalvo\b/g, "guardado"],
  [/\bRemover\b/g, "Remover"],
  [/\bclube do coração\b/gi, "clube favorito"],
  [/\bcelular\b/gi, "telemóvel"],
  [/\busuário\b/gi, "utilizador"],
  [/\busuários\b/gi, "utilizadores"],
  [/\bpersonalização\b/g, "personalização"],
  [/\bAjuste os filtros\b/g, "Ajuste os filtros"],
  [/\bFaça uma nova pesquisa\b/g, "Faça uma nova pesquisa"],
  [/\bAtualizado agora\b/g, "Atualizado agora"],
  [/\bAtualizar dados\b/g, "Atualizar dados"],
  [/\bÚltima atualização\b/g, "Última atualização"],
  [/\bMadrugada\b/g, "Madrugada"],
  [/\bCopa\b/g, "Taça"],
  [/\bOdds History\b/g, "Histórico de Odds"],
  [/\bHistórico Odds\b/g, "Histórico de Odds"],
  [/\bMeus Jogos\b/g, "Os meus jogos"],
  [/\bMeus Filtros\b/g, "Os meus filtros"],
  [/\bMinha conta\b/g, "A minha conta"],
  [/\bConta\b/g, "Conta"],
  [/\bEntrar gratuitamente\b/g, "Entrar gratuitamente"],
  [/\bCompletar cadastro\b/g, "Completar registo"],
  [/\bComplete seu cadastro\b/g, "Complete o seu registo"],
  [/\bVocê pode\b/g, "Pode"],
  [/\bvocê pode\b/g, "pode"],
  [/\bseu e-mail\b/g, "o seu email"],
  [/\bSeu e-mail\b/g, "O seu email"],
  [/\bE-mail\b/g, "Email"],
  [/\be-mail\b/g, "email"],
  [/\bAcréscimos\b/g, "Tempo de compensação"],
  [/\bacréscimos\b/g, "tempo de compensação"],
  [/\b1T\b/g, "1.ª parte"],
  [/\b2T\b/g, "2.ª parte"],
  [/\bprimeiro tempo\b/gi, "primeira parte"],
  [/\bsegundo tempo\b/gi, "segunda parte"],
  [/\bpartida\b/g, "jogo"],
  [/\bPartida\b/g, "Jogo"],
  [/\bpartidas\b/g, "jogos"],
  [/\bPartidas\b/g, "Jogos"],
  [/\bpré-jogo\b/g, "pré-jogo"],
];

const convertString = (value) =>
  replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);

export const localizePtPT = (value) => {
  if (typeof value === "string") return convertString(value);
  if (Array.isArray(value)) return value.map(localizePtPT);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizePtPT(item)])
    );
  }
  return value;
};
