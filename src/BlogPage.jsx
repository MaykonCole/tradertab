import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Eye, Scale, Star, Target, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { incrementBlogView, loadArticleRating, observeBlogStats, saveArticleRating } from "./firebase";

const copy = {
  pt: {
    hubTitle: "Conteúdos TraderTab",
    hubIntro: "Guias originais sobre TraderTab, leitura de mercado e componentes do HistoryOdd para transformar dados em contexto e análise mais estruturada.",
    read: "Ler conteúdo",
    back: "Voltar aos conteúdos",
    updated: "Atualizado em setembro de 2026",
    disclaimer: "Conteúdo educacional. Odds e classificações não garantem resultados. 18+ Ministério da Fazenda adverte: Aposta não é investimento.",
    instagram: "Ver publicação do HistoryOdd no Instagram",
  },
  "pt-PT": {
    hubTitle: "Conteúdos TraderTab",
    hubIntro: "Guias originais sobre TraderTab, leitura de mercado e componentes do HistoryOdd para transformar dados em contexto e numa análise mais estruturada.",
    read: "Ler conteúdo",
    back: "Voltar aos conteúdos",
    updated: "Atualizado em setembro de 2026",
    disclaimer: "Conteúdo educativo. Odds e classificações não garantem resultados. Aposte de forma responsável.",
    instagram: "Ver publicação do HistoryOdd no Instagram",
  },
  en: {
    hubTitle: "TraderTab Guides",
    hubIntro: "Original guides about TraderTab, market reading and HistoryOdd components, designed to turn data into context and a more structured analysis process.",
    read: "Read guide",
    back: "Back to guides",
    updated: "Updated September 2026",
    disclaimer: "Educational content. Odds and classifications do not guarantee outcomes. Gamble responsibly.",
    instagram: "View the HistoryOdd post on Instagram",
  },
  es: {
    hubTitle: "Contenidos TraderTab",
    hubIntro: "Guías originales sobre TraderTab, lectura de mercado y componentes de HistoryOdd para convertir datos en contexto y un análisis más estructurado.",
    read: "Leer contenido",
    back: "Volver a contenidos",
    updated: "Actualizado en septiembre de 2026",
    disclaimer: "Contenido educativo. Las cuotas y clasificaciones no garantizan resultados. Juega con responsabilidad.",
    instagram: "Ver la publicación de HistoryOdd en Instagram",
  },
};

const articles = {
  "traders-calma-mp-bets": {
    icon: Scale,
    pt: {
      title: "Traders, calma.",
      excerpt: "Entenda os prazos de uma possível medida provisória sobre apostas online e o que ainda falta definir.",
      sections: [
        ["O que sabemos agora", "Uma medida provisória (MP) pode mudar as regras das apostas online, mas nenhuma MP sobre essa possível proibição foi publicada até 24 de setembro de 2026. Ainda não há como saber quais mercados seriam afetados, quando as mudanças começariam ou se as plataformas teriam um período de adaptação."],
        ["Os prazos da MP", "Se for publicada, a MP poderá produzir efeitos imediatos, de acordo com as regras escritas nela. Em seguida, precisará passar pela Câmara dos Deputados e pelo Senado. O prazo inicial de vigência é de 60 dias, prorrogado automaticamente uma vez por mais 60 dias se a votação não terminar. Se a análise não ocorrer nos primeiros 45 dias, a tramitação entra em regime de urgência."],
        ["O papel do Congresso", "Nesse processo, o Congresso pode aprovar, alterar ou rejeitar a MP. Se o prazo terminar sem aprovação, ela perde a eficácia. Portanto, os 120 dias não significam que tudo continuará igual até lá: o que vale desde a publicação depende do conteúdo da própria medida."],
        ["O que acompanhar", "O possível ressarcimento de pessoas endividadas com apostas também não tem regras definidas e pode ser tratado separadamente. Por enquanto, vale acompanhar a publicação oficial e evitar decisões baseadas em suposições. Com as regras em mãos, será possível entender o que realmente muda para cada trader."],
      ],
    },
    "pt-PT": {
      title: "Traders, calma.",
      excerpt: "O que se sabe sobre a possível medida provisória para restringir apostas online no Brasil.",
      sections: [
        ["O que está em discussão", "O governo brasileiro estuda uma medida provisória (MP) para proibir apostas online. Até 24 de setembro de 2026, a MP ainda não tinha sido publicada, pelo que esta proposta não criou uma nova regra em vigor."],
        ["O que falta definir", "Ainda não se conhecem o texto final, o alcance de uma eventual proibição, as regras para operadores autorizados nem possíveis períodos de transição. Por isso, não é possível afirmar como cada mercado ou plataforma seria afetado."],
        ["Possível ressarcimento", "Também se avalia recorrer à Justiça para pedir que plataformas ressarçam pessoas endividadas com apostas. Esta hipótese pode avançar separadamente da MP; os critérios e os valores ainda não foram definidos."],
        ["O próximo passo", "Traders, calma: uma intenção em estudo não é a regra final. Acompanhe a publicação oficial e as orientações das plataformas antes de tomar decisões. Um texto publicado permitirá perceber os efeitos concretos."],
      ],
    },
    en: {
      title: "Traders, stay calm.",
      excerpt: "What is known about Brazil's possible provisional measure on online betting.",
      sections: [
        ["What is being discussed", "Brazil's government is considering a provisional measure to ban online betting. As of September 24, 2026, the measure had not been published, so this proposal has not introduced a new rule."],
        ["What remains unclear", "The final wording, the scope of a possible ban, rules for licensed operators and any transition period have yet to be defined. It is too early to say how individual markets or platforms would be affected."],
        ["Possible compensation", "The government is also considering legal action to seek compensation from betting companies for people who fell into debt through gambling. This could proceed separately from the measure; eligibility and amounts have not been set."],
        ["What to watch", "Traders, stay calm: a proposal under discussion is not a final rule. Follow official publications and your platforms' guidance before making decisions. Once the text is available, its practical effects can be assessed."],
      ],
    },
    es: {
      title: "Traders, calma.",
      excerpt: "Qué se sabe sobre la posible medida provisional para restringir las apuestas online en Brasil.",
      sections: [
        ["Qué se está estudiando", "El Gobierno brasileño estudia una medida provisional para prohibir las apuestas online. Hasta el 24 de septiembre de 2026, la medida aún no se había publicado, por lo que esta propuesta no ha creado una nueva norma vigente."],
        ["Qué falta definir", "Todavía no se conocen el texto final, el alcance de una posible prohibición, las reglas para operadores autorizados ni los eventuales plazos de transición. Es pronto para afirmar cómo se vería afectado cada mercado o plataforma."],
        ["Posible compensación", "El Gobierno también estudia acudir a la Justicia para reclamar a las plataformas una compensación para personas endeudadas por las apuestas. Esta posibilidad podría avanzar por separado; aún no hay criterios ni importes definidos."],
        ["Qué hacer ahora", "Traders, calma: una propuesta en estudio no es la norma final. Sigue las publicaciones oficiales y las indicaciones de las plataformas antes de tomar decisiones. El texto publicado permitirá valorar sus efectos reales."],
      ],
    },
  },
  "classificacao-lay": {
    icon: TrendingDown,
    pt: {
      title: "Como funciona a classificação Lay no TraderTab",
      excerpt: "Entenda quais sinais fazem um jogo aparecer como Lay e por que posição, Race e diferença de força importam.",
      sections: [
        ["O que significa Lay no TraderTab", "A classificação Lay organiza partidas em que o conjunto de dados pré-jogo aponta uma vantagem estrutural do favorito, mas com características que merecem leitura cuidadosa antes de qualquer operação. Ela não é uma recomendação automática de entrada: é um filtro para reduzir o universo de jogos e destacar cenários com um padrão específico."],
        ["Como a classificação é construída", "O TraderTab cruza principalmente a posição das equipes, os pontos da Race e a diferença entre os lados. A ordenação prioriza a diferença de pontos da Race; quando essa diferença empata, a posição serve como critério de desempate. Isso evita tratar duas partidas visualmente parecidas como equivalentes quando o contexto competitivo é diferente."],
        ["Como interpretar na prática", "Use a classificação Lay como ponto de partida. Compare posição, Race, forma recente e odds. Quanto mais coerentes forem esses dados entre si, mais clara tende a ser a leitura do jogo. Se os sinais entrarem em conflito, a melhor decisão pode ser simplesmente não operar."],
      ],
    },
    "pt-PT": {
      title: "Como funciona a classificação Lay no TraderTab",
      excerpt: "Perceba quais os sinais que fazem um jogo surgir como Lay e porque posição, Race e diferença de força são importantes.",
      sections: [
        ["O que significa Lay no TraderTab", "A classificação Lay organiza jogos em que o conjunto de dados pré-jogo aponta uma vantagem estrutural do favorito, mas com características que exigem uma leitura cuidada antes de qualquer operação. Não é uma recomendação automática de entrada: é um filtro para reduzir o universo de jogos e destacar cenários com um padrão específico."],
        ["Como a classificação é construída", "O TraderTab cruza sobretudo a posição das equipas, os pontos da Race e a diferença entre os dois lados. A ordenação dá prioridade à diferença de pontos da Race; quando existe empate, a posição funciona como critério de desempate."],
        ["Como interpretar na prática", "Use a classificação Lay como ponto de partida. Compare posição, Race, forma recente e odds. Quanto mais coerentes forem estes dados entre si, mais clara tende a ser a leitura do jogo."],
      ],
    },
    en: {
      title: "How TraderTab's Lay classification works",
      excerpt: "Learn which signals can place a match in the Lay group and why position, Race and strength gaps matter.",
      sections: [
        ["What Lay means inside TraderTab", "The Lay classification groups matches where pre-match data shows a structural favourite but also a pattern that deserves closer analysis before any trade. It is not an automatic betting recommendation. It is a filtering layer designed to reduce the match universe and surface a specific profile."],
        ["How the classification is built", "TraderTab primarily combines league position, Race points and the gap between both sides. Sorting prioritises the Race-points difference; when that difference is tied, league position becomes the tiebreaker."],
        ["How to use it", "Treat Lay as a starting point. Compare position, Race, recent form and odds together. The more these signals agree, the clearer the pre-match picture becomes. Conflicting signals are a reason to be selective rather than force a trade."],
      ],
    },
    es: {
      title: "Cómo funciona la clasificación Lay en TraderTab",
      excerpt: "Conoce qué señales hacen que un partido aparezca como Lay y por qué importan la posición, Race y la diferencia de fuerza.",
      sections: [
        ["Qué significa Lay en TraderTab", "La clasificación Lay agrupa partidos donde los datos previos muestran un favorito estructural, pero también un patrón que merece un análisis más cuidadoso antes de cualquier operación. No es una recomendación automática de apuesta."],
        ["Cómo se construye", "TraderTab combina principalmente la posición, los puntos de Race y la diferencia entre ambos equipos. La ordenación prioriza la diferencia de puntos de Race; en caso de empate, la posición funciona como desempate."],
        ["Cómo interpretarla", "Usa Lay como punto de partida. Compara posición, Race, forma reciente y cuotas. Cuanto más coherentes sean estas señales, más clara será la lectura previa al partido."],
      ],
    },
  },
  "classificacao-back": {
    icon: TrendingUp,
    pt: {
      title: "Como funciona a classificação Back no TraderTab",
      excerpt: "Veja como o TraderTab separa cenários de maior domínio do favorito e como validar esse contexto.",
      sections: [
        ["O objetivo da classificação Back", "A classificação Back destaca jogos em que os indicadores pré-jogo apontam maior consistência a favor de um lado. O objetivo é facilitar a triagem de partidas em que posição, Race e preço estão mais alinhados."],
        ["Não olhe apenas para a odd", "Uma odd baixa sozinha não transforma um jogo em bom cenário. O TraderTab ajuda a colocar o preço dentro de contexto: força relativa, classificação, sequência recente e diferença de Race ajudam a mostrar se o favoritismo tem fundamento estatístico."],
        ["Leitura combinada", "O uso mais eficiente é cruzar a classificação com os filtros do site. Assim você consegue comparar jogos semelhantes, eliminar discrepâncias e chegar a uma lista menor de partidas realmente interessantes para análise."],
      ],
    },
    "pt-PT": {
      title: "Como funciona a classificação Back no TraderTab",
      excerpt: "Veja como o TraderTab separa cenários de maior domínio do favorito e como validar esse contexto.",
      sections: [["O objetivo da classificação Back", "A classificação Back destaca jogos em que os indicadores pré-jogo apontam maior consistência a favor de um lado. O objetivo é facilitar a triagem de partidas em que posição, Race e preço estão mais alinhados."],["Não olhe apenas para a odd", "Uma odd baixa, por si só, não transforma um jogo num bom cenário. O TraderTab coloca o preço em contexto com força relativa, classificação, forma recente e diferença de Race."],["Leitura combinada", "Cruze a classificação com os filtros do site para comparar jogos semelhantes e chegar a uma lista menor de partidas para análise."]],
    },
    en: {
      title: "How TraderTab's Back classification works",
      excerpt: "See how TraderTab separates stronger favourite profiles and how to validate that context.",
      sections: [["What Back is designed to show", "The Back classification highlights matches where pre-match indicators show stronger consistency on one side. It helps users screen matches where position, Race and market price are more aligned."],["Do not read the odd in isolation", "A short price alone does not make a match attractive. TraderTab puts that price into context using relative strength, standings, recent form and Race difference."],["Combine the signals", "The most useful workflow is to combine the classification with site filters so comparable matches can be reviewed together and weak or contradictory cases can be removed."]],
    },
    es: {
      title: "Cómo funciona la clasificación Back en TraderTab",
      excerpt: "Descubre cómo TraderTab separa perfiles de favorito más sólidos y cómo validar ese contexto.",
      sections: [["Qué busca mostrar Back", "La clasificación Back destaca partidos donde los indicadores previos muestran mayor consistencia a favor de un lado. Facilita encontrar encuentros donde posición, Race y precio están más alineados."],["No mires solo la cuota", "Una cuota baja por sí sola no convierte un partido en un buen escenario. TraderTab pone el precio en contexto mediante fuerza relativa, clasificación, forma reciente y diferencia de Race."],["Combina las señales", "Cruza la clasificación con los filtros del sitio para comparar partidos similares y reducir la lista a los casos más interesantes para analizar."]],
    },
  },
  "race-no-futebol": {
    icon: BarChart3,
    pt: {
      title: "O que é Race e como o TraderTab usa esse dado",
      excerpt: "Entenda a lógica da Race, a diferença de pontos e por que ela complementa a posição tradicional na tabela.",
      sections: [["Race como leitura de desempenho", "No TraderTab, Race funciona como uma camada adicional de comparação entre as equipes. Em vez de olhar somente a posição na tabela, o sistema também considera a diferença de pontos acumulados no recorte analisado."],["Por que a diferença importa", "Dois times podem ocupar posições próximas, mas apresentar uma distância relevante em pontos. Por isso, o TraderTab prioriza a diferença de Race na ordenação e usa a posição como desempate quando necessário."],["Race não substitui contexto", "A métrica é mais útil quando combinada com forma, competição e odds. Ela ajuda a organizar jogos e encontrar discrepâncias, mas não deve ser interpretada isoladamente como previsão do resultado."]],
    },
    "pt-PT": { title: "O que é Race e como o TraderTab utiliza este dado", excerpt: "Compreenda a lógica da Race, a diferença de pontos e porque complementa a posição tradicional na tabela.", sections: [["Race como leitura de desempenho", "No TraderTab, Race funciona como uma camada adicional de comparação entre as equipas, para além da posição na tabela."],["Porque a diferença importa", "Duas equipas podem estar em posições próximas e ainda assim apresentar uma diferença relevante em pontos. Por isso, o TraderTab dá prioridade à diferença de Race na ordenação."],["Race não substitui contexto", "A métrica é mais útil quando combinada com forma, competição e odds. Ajuda a organizar jogos, mas não deve ser usada isoladamente como previsão."]] },
    en: { title: "What Race means and how TraderTab uses it", excerpt: "Understand Race points, the points gap and why it complements traditional league position.", sections: [["Race as a performance layer", "Inside TraderTab, Race adds another comparison layer beyond league position by looking at the points gap between the teams in the selected context."],["Why the gap matters", "Teams can sit close in the table while still having a meaningful points gap. TraderTab therefore prioritises the Race difference when ordering comparable matches."],["Race needs context", "Race becomes more useful when combined with form, competition type and odds. It helps organise opportunities, but it is not a standalone prediction of the result."]] },
    es: { title: "Qué es Race y cómo la usa TraderTab", excerpt: "Entiende los puntos Race, su diferencia y por qué complementan la posición tradicional en la tabla.", sections: [["Race como capa de rendimiento", "En TraderTab, Race añade una comparación adicional más allá de la posición en la tabla, usando la diferencia de puntos entre los equipos."],["Por qué importa la diferencia", "Dos equipos pueden estar cerca en la clasificación y aun así tener una distancia relevante de puntos. Por eso TraderTab prioriza la diferencia de Race al ordenar partidos."],["Race necesita contexto", "La métrica funciona mejor junto con forma, competición y cuotas. Ayuda a organizar escenarios, pero no es una predicción aislada del resultado."]] },
  },
  "como-interpretar-odds": {
    icon: Scale,
    pt: { title: "Como interpretar odds sem olhar apenas para o número", excerpt: "Aprenda a colocar a odd em contexto com favoritismo, força relativa e filtros do TraderTab.", sections: [["Odd é preço, não certeza", "A odd representa um preço de mercado. Uma cotação menor indica maior probabilidade implícita, mas não significa que o evento acontecerá. O valor da leitura está em comparar esse preço com o contexto do jogo."],["Contexto antes do preço", "No TraderTab, a odd pode ser analisada junto com posição, forma, Race, competição e classificação. Isso ajuda a identificar quando um preço parece coerente com os dados e quando existe uma possível discrepância."],["Comparar é melhor do que isolar", "Em vez de decidir com base em um único jogo, use filtros para comparar partidas com perfil semelhante. Essa abordagem reduz decisões impulsivas e torna o processo de análise mais consistente."]] },
    "pt-PT": { title: "Como interpretar odds sem olhar apenas para o número", excerpt: "Aprenda a colocar a odd em contexto com favoritismo, força relativa e filtros do TraderTab.", sections: [["Odd é preço, não certeza", "A odd representa um preço de mercado. Uma cotação menor indica maior probabilidade implícita, mas não garante o acontecimento."],["Contexto antes do preço", "No TraderTab, a odd pode ser analisada em conjunto com posição, forma, Race, competição e classificação."],["Comparar é melhor do que isolar", "Utilize filtros para comparar jogos com perfis semelhantes. Isto ajuda a tornar o processo de análise mais consistente."]] },
    en: { title: "How to read odds without looking only at the number", excerpt: "Put market odds into context with favouritism, relative strength and TraderTab filters.", sections: [["Odds are prices, not certainties", "An odd is a market price. A shorter price implies a higher probability, but it does not guarantee an outcome. The useful question is whether that price fits the match context."],["Context before price", "TraderTab lets you read odds together with standings, form, Race, competition and classification. This makes it easier to spot whether a price appears consistent with the surrounding data."],["Comparison beats isolation", "Instead of judging one match in isolation, use filters to compare similar profiles. That creates a more repeatable and less impulsive analysis process."]] },
    es: { title: "Cómo interpretar cuotas sin mirar solo el número", excerpt: "Pon las cuotas en contexto con favoritismo, fuerza relativa y filtros de TraderTab.", sections: [["Las cuotas son precios, no certezas", "Una cuota es un precio de mercado. Una cotización menor implica mayor probabilidad, pero no garantiza un resultado."],["Contexto antes que precio", "TraderTab permite leer las cuotas junto con clasificación, forma, Race, competición y tipo de partido."],["Comparar es mejor que aislar", "Usa filtros para comparar partidos con perfiles similares y construir un proceso de análisis más consistente."]] },
  },
  "jogos-parelhos-balanced": {
    icon: Scale,
    pt: { title: "O que significa Parelho / Balanced no TraderTab", excerpt: "Entenda por que alguns jogos ficam fora de Back e Lay e entram em uma categoria própria de equilíbrio.", sections: [["Quando o jogo é classificado como Parelho", "A categoria Parelho reúne partidas em que os dados e o preço indicam menor distância entre os lados. No site, ela aparece separada de Back e Lay para facilitar uma leitura específica de confrontos mais equilibrados."],["Por que separar esses jogos", "Misturar jogos parelhos com favoritos fortes reduz a qualidade da comparação. Ao criar uma categoria própria, o TraderTab permite analisar mercados e padrões dentro de grupos mais homogêneos."],["Como usar o filtro", "A rota Balanced e o filtro Parelho ajudam a estudar apenas esse tipo de confronto. É especialmente útil para comparar odds, posições e Race sem a interferência de jogos com favoritismo muito acentuado."]] },
    "pt-PT": { title: "O que significa Equilibrado / Balanced no TraderTab", excerpt: "Perceba porque alguns jogos ficam fora de Back e Lay e entram numa categoria própria de equilíbrio.", sections: [["Quando o jogo é equilibrado", "A categoria reúne jogos em que os dados e o preço indicam menor distância entre os dois lados."],["Porque separar", "Separar jogos equilibrados de favoritos fortes melhora a qualidade da comparação entre partidas semelhantes."],["Como utilizar", "A rota Balanced e o filtro correspondente permitem estudar apenas este perfil de jogo."]] },
    en: { title: "What Balanced means inside TraderTab", excerpt: "Learn why some matches sit outside Back and Lay and belong to a separate balanced category.", sections: [["When a match is Balanced", "Balanced groups matches where data and market price suggest a smaller gap between both sides. It is separated from Back and Lay so users can analyse these fixtures as their own profile."],["Why separate them", "Mixing balanced matches with strong favourites weakens comparisons. A dedicated category keeps the dataset more homogeneous."],["How to use the filter", "The Balanced route and filter let you study only this match profile and compare odds, standings and Race without strong-favourite cases distorting the view."]] },
    es: { title: "Qué significa Parelho / Balanced en TraderTab", excerpt: "Entiende por qué algunos partidos quedan fuera de Back y Lay y entran en una categoría equilibrada.", sections: [["Cuándo un partido es Balanced", "La categoría agrupa partidos donde los datos y el precio muestran una menor diferencia entre ambos lados."],["Por qué separarlos", "Separar partidos equilibrados de favoritos fuertes mejora la calidad de la comparación."],["Cómo usar el filtro", "La ruta Balanced y su filtro permiten estudiar exclusivamente este perfil de encuentro."]] },
  },
  "como-usar-filtros": {
    icon: Target,
    pt: { title: "Como usar os filtros do TraderTab para reduzir a lista de jogos", excerpt: "Um fluxo prático para combinar horário, competição, posição, odds, Race e classificação.", sections: [["Comece pelo objetivo da análise", "Antes de marcar filtros, defina o tipo de jogo que procura. Você quer favoritos fortes, jogos parelhos ou apenas partidas dentro de determinada faixa de odd? Essa definição evita aplicar filtros sem propósito."],["Filtre em camadas", "Uma boa sequência é começar por data e horário, depois competição e gênero, e só então adicionar posição, forma, odds, Race e classificação. Dessa forma fica mais fácil perceber qual filtro realmente está eliminando ou mantendo jogos."],["Salve o que funciona", "Usuários logados podem manter filtros e jogos favoritos. Isso permite transformar uma análise eventual em um processo repetível e comparar o mesmo tipo de cenário ao longo do tempo."]] },
    "pt-PT": { title: "Como utilizar os filtros do TraderTab para reduzir a lista de jogos", excerpt: "Um fluxo prático para combinar hora, competição, posição, odds, Race e classificação.", sections: [["Comece pelo objetivo", "Defina primeiro que tipo de jogo pretende analisar."],["Filtre por camadas", "Comece por data e hora, depois competição e género, e só então acrescente posição, forma, odds, Race e classificação."],["Guarde o que funciona", "Utilizadores autenticados podem manter filtros e jogos favoritos para repetir o mesmo processo de análise."]] },
    en: { title: "How to use TraderTab filters to narrow the match list", excerpt: "A practical workflow combining time, competition, position, odds, Race and classification.", sections: [["Start with the analysis goal", "Decide what kind of match you are looking for before adding filters: strong favourites, balanced fixtures or a specific odds range."],["Filter in layers", "Start with date and time, then competition and gender, followed by position, form, odds, Race and classification. This makes it easier to understand which filter changes the list."],["Save repeatable setups", "Logged-in users can keep favourite filters and matches, turning one-off analysis into a repeatable workflow."]] },
    es: { title: "Cómo usar los filtros de TraderTab para reducir la lista de partidos", excerpt: "Un flujo práctico combinando horario, competición, posición, cuotas, Race y clasificación.", sections: [["Empieza por el objetivo", "Define primero qué tipo de partido quieres analizar."],["Filtra por capas", "Empieza por fecha y horario, continúa con competición y género, y después añade posición, forma, cuotas, Race y clasificación."],["Guarda lo que funciona", "Los usuarios conectados pueden conservar filtros y partidos favoritos para repetir su proceso de análisis."]] },
  },

  "historyodd-regua-minuto": {
    icon: BarChart3,
    sourceUrl: "https://www.instagram.com/p/DdRjEDxDihD/",
    product: "HistoryOdd",
    pt: {
      title: "Régua por Minuto: como transformar o tempo em contexto de mercado",
      excerpt: "Entenda por que observar quanto a odd paga minuto a minuto pode revelar ritmo, desaceleração e mudanças que o preço atual sozinho não mostra.",
      sections: [
        ["O preço atual conta pouco sem o caminho até ele", "No trading esportivo, duas odds iguais podem carregar histórias completamente diferentes. Uma pode ter chegado ao mesmo preço por uma queda contínua e organizada; outra pode ter passado por correções, pausas e acelerações. A Régua por Minuto do HistoryOdd foi pensada para tornar esse caminho legível. Em vez de concentrar a análise somente na cotação atual, ela distribui a variação ao longo do tempo e mostra quanto o mercado entregou em cada minuto do jogo."],
        ["Por que medir o pagamento por minuto", "O percentual pago em um minuto funciona melhor quando é tratado como parte de uma sequência. Um minuto de 4% não é necessariamente forte nem fraco. Se os minutos anteriores foram 1%, 2% e 2%, ele pode sinalizar aceleração. Se vinham em 7%, 6% e 5%, o mesmo 4% pode indicar perda de ritmo. É essa comparação que transforma um número isolado em informação útil."],
        ["Média, mediana e ritmo respondem perguntas diferentes", "A média resume a intensidade geral, enquanto a mediana ajuda a reduzir o efeito de movimentos muito fora do padrão. Já a leitura dos últimos minutos aproxima a análise do que está acontecendo agora. O HistoryOdd combina essas referências para classificar o ritmo recente como linear, acima da média, abaixo da média ou oscilando. Nenhuma métrica precisa ser usada sozinha; o valor está em observar quando elas contam a mesma história — ou quando começam a divergir."],
        ["Um exemplo de leitura", "Imagine uma sequência de pagamentos de 6%, 5%, 5%, 4% e 2%. A odd ainda pode continuar caindo, mas a Régua revela que a velocidade da queda está diminuindo. Em outro cenário, uma sequência de 1%, 2%, 3%, 5% e 6% aponta para um mercado que ganhou intensidade. O preço final de ambos os exemplos pode parecer semelhante em determinado momento, porém a dinâmica por trás dele é oposta."],
        ["O que a Régua não deve fazer por você", "A Régua por Minuto não prevê sozinha o próximo movimento e não substitui contexto de jogo, liquidez, placar, tempo restante ou estratégia. Seu papel é organizar o comportamento passado da odd em uma escala temporal objetiva. Quanto melhor o trader entende o ritmo que trouxe o mercado até o ponto atual, menor a necessidade de reagir apenas à sensação de que o preço está 'rápido' ou 'lento'."],
        ["Onde está o ganho de leitura", "O benefício real aparece quando o minuto atual é comparado com o padrão recente. A ferramenta ajuda a perceber acelerações, desacelerações e mudanças de comportamento antes que elas fiquem óbvias apenas olhando a cotação. O foco não é descobrir um número mágico, e sim responder uma pergunta simples com mais contexto: o mercado está pagando como vinha pagando ou algo mudou?"],
      ],
    },
    "pt-PT": {
      title: "Régua por Minuto: como transformar o tempo em contexto de mercado",
      excerpt: "Perceba porque observar quanto a odd paga minuto a minuto pode revelar ritmo, desaceleração e mudanças que o preço atual, por si só, não mostra.",
      sections: [
        ["O preço atual diz pouco sem o percurso até ele", "Duas odds iguais podem ter histórias completamente diferentes. Uma pode ter chegado ao preço atual através de uma queda contínua; outra pode ter passado por correções e acelerações. A Régua por Minuto do HistoryOdd torna esse percurso visível ao distribuir a variação ao longo do tempo."],
        ["Porque medir o pagamento por minuto", "Um pagamento de 4% não é forte ou fraco por definição. Depois de minutos de 1%, 2% e 2%, pode significar aceleração; depois de 7%, 6% e 5%, pode indicar perda de ritmo. A sequência é que dá significado ao número."],
        ["Média, mediana e ritmo", "A média resume a intensidade geral, a mediana reduz o peso de movimentos extremos e os últimos minutos aproximam a leitura do momento atual. O HistoryOdd utiliza estas referências para mostrar se o ritmo está linear, acima, abaixo ou oscilante."],
        ["Exemplo de leitura", "Uma sequência de 6%, 5%, 5%, 4% e 2% sugere desaceleração, mesmo que a odd continue a cair. Já 1%, 2%, 3%, 5% e 6% mostra ganho de intensidade. O preço atual pode ser semelhante, mas o comportamento que o produziu é diferente."],
        ["O que a Régua não substitui", "A ferramenta não prevê sozinha o próximo movimento e não substitui o contexto do jogo, liquidez, marcador ou estratégia. O seu papel é organizar o comportamento recente da odd numa escala temporal clara."],
      ],
    },
    en: {
      title: "Minute Ruler: turning time into market context",
      excerpt: "See how measuring the odd minute by minute can expose pace, deceleration and behavioural shifts that the current price alone cannot show.",
      sections: [
        ["The current price is only the final frame", "Two identical odds may have arrived there through completely different paths. One can be the result of a steady decline, while another may include pauses, rebounds and sharp accelerations. HistoryOdd's Minute Ruler makes that path visible by distributing price movement across the match timeline."],
        ["Why minute-by-minute payment matters", "A 4% move is not inherently strong or weak. After 1%, 2% and 2%, it may represent acceleration. After 7%, 6% and 5%, it may indicate fading momentum. The sequence gives the number its meaning."],
        ["Average, median and recent pace", "The average summarises overall intensity, the median reduces the influence of outliers, and the most recent minutes bring the reading closer to the current market. HistoryOdd combines these perspectives to identify whether the pace is linear, above average, below average or oscillating."],
        ["A practical example", "A sequence of 6%, 5%, 5%, 4% and 2% suggests deceleration even if the odd is still falling. A sequence of 1%, 2%, 3%, 5% and 6% tells the opposite story: the market is gaining intensity. The current price may look similar, but the path is not."],
        ["What the tool does not replace", "The Minute Ruler is not a standalone forecast and does not replace match context, liquidity, score, time remaining or a trading plan. Its job is to organise recent price behaviour into a time-based framework that is easier to compare."],
      ],
    },
    es: {
      title: "Regla por Minuto: convertir el tiempo en contexto de mercado",
      excerpt: "Descubre cómo medir el movimiento de la cuota minuto a minuto puede revelar ritmo, desaceleración y cambios que el precio actual no muestra por sí solo.",
      sections: [
        ["El precio actual es solo una fotografía", "Dos cuotas iguales pueden haber llegado al mismo punto por caminos completamente distintos. Una puede caer de forma continua y otra alternar correcciones y aceleraciones. La Regla por Minuto de HistoryOdd hace visible ese recorrido."],
        ["Por qué medir el pago por minuto", "Un movimiento del 4% no es fuerte ni débil por definición. Después de 1%, 2% y 2% puede señalar aceleración; después de 7%, 6% y 5% puede indicar pérdida de ritmo. La secuencia es la que aporta contexto."],
        ["Media, mediana y ritmo reciente", "La media resume la intensidad general, la mediana reduce el efecto de valores extremos y los últimos minutos acercan la lectura al presente. HistoryOdd reúne estas referencias para identificar un ritmo lineal, superior, inferior u oscilante."],
        ["Un ejemplo práctico", "Una secuencia de 6%, 5%, 5%, 4% y 2% sugiere desaceleración aunque la cuota siga bajando. Una secuencia de 1%, 2%, 3%, 5% y 6% muestra un mercado que gana intensidad."],
        ["Lo que la herramienta no sustituye", "La Regla por Minuto no es una predicción aislada y no sustituye contexto del partido, liquidez, marcador, tiempo restante ni estrategia. Su función es organizar el comportamiento reciente del precio para facilitar la comparación."],
      ],
    },
  },
  "historyodd-regua-previsao": {
    icon: TrendingUp,
    sourceUrl: "https://www.instagram.com/p/DdOxHFKDlBT/",
    product: "HistoryOdd",
    pt: {
      title: "Régua Previsão: usar o comportamento passado para avaliar o próximo movimento",
      excerpt: "Uma projeção se torna mais útil quando é comparada ao ritmo real que o mercado vinha entregando. Entenda a lógica da Régua Previsão do HistoryOdd.",
      sections: [
        ["Prever sem contexto é apenas estimar", "No mercado de odds, uma projeção isolada pode parecer precisa apenas porque apresenta um número. O problema é que um número futuro só tem utilidade quando existe uma explicação para ele. A Régua Previsão do HistoryOdd parte do histórico recente para construir essa referência: quanto o mercado pagou, qual foi o ritmo e como esse comportamento pode se prolongar nos próximos intervalos."],
        ["A projeção começa no que já aconteceu", "Antes de olhar para frente, a ferramenta organiza os intervalos anteriores. Isso permite perceber se o mercado vinha acelerando, desacelerando, oscilando ou mantendo um padrão relativamente constante. Uma previsão coerente deve respeitar esse contexto ou, quando divergir dele, deixar claro que existe uma mudança de comportamento em curso."],
        ["Por que comparar previsto e realizado", "A parte mais interessante de uma previsão não é apenas o valor estimado, mas o que acontece depois. Conforme o jogo avança, a projeção pode ser confrontada com o preço realmente alcançado. Essa comparação permite identificar em quais cenários o comportamento foi estável, quando houve desvio e quanto o mercado mudou em relação ao padrão anterior."],
        ["Exemplo: desaceleração versus retomada", "Considere um mercado que pagou forte em dois intervalos consecutivos, mas depois reduziu a intensidade. Projetar a mesma velocidade para frente pode superestimar a queda. Em outro jogo, um período lento seguido por dois intervalos cada vez mais fortes pode justificar uma projeção mais agressiva. A Régua não transforma isso em certeza; ela torna explícita a hipótese por trás do próximo preço."],
        ["A projeção deve ser tratada como cenário", "Placar, ataques, expulsões, liquidez e mudanças bruscas de percepção podem quebrar qualquer padrão anterior. Por isso, a leitura mais profissional é tratar a previsão como um cenário de continuidade baseado nos dados disponíveis, não como destino obrigatório da odd."],
        ["O valor está no confronto entre passado, presente e futuro", "Quando histórico, ritmo atual e projeção aparecem juntos, o trader consegue fazer uma pergunta melhor do que 'qual será a próxima odd?'. A pergunta passa a ser: 'a trajetória que está sendo projetada ainda faz sentido diante do que o mercado está entregando agora?'. Essa diferença muda a previsão de palpite para instrumento de contexto."],
      ],
    },
    "pt-PT": {
      title: "Régua Previsão: utilizar o comportamento passado para avaliar o próximo movimento",
      excerpt: "Uma projeção torna-se mais útil quando é comparada com o ritmo real que o mercado vinha a entregar.",
      sections: [
        ["Prever sem contexto é apenas estimar", "Uma projeção isolada pode parecer convincente apenas porque apresenta um número. A Régua Previsão parte do histórico recente para mostrar quanto o mercado pagou, qual foi o ritmo e como esse comportamento poderia prolongar-se nos próximos intervalos."],
        ["A previsão começa no passado", "A ferramenta organiza primeiro os intervalos anteriores para identificar aceleração, desaceleração, oscilação ou continuidade. Uma projeção ganha significado quando pode ser comparada com este padrão."],
        ["Previsto versus realizado", "À medida que o jogo avança, a odd prevista pode ser comparada com a odd realmente alcançada. Isso permite perceber quando o mercado manteve o padrão e quando se desviou dele."],
        ["Trate a projeção como cenário", "Marcador, expulsões, liquidez ou mudanças súbitas de percepção podem quebrar qualquer padrão. Por isso, a projeção deve ser lida como um cenário de continuidade, não como uma certeza."],
        ["O valor está na comparação", "O objetivo deixa de ser adivinhar a próxima odd e passa a ser avaliar se a trajetória projetada continua coerente com aquilo que o mercado está efetivamente a entregar."],
      ],
    },
    en: {
      title: "Forecast Ruler: using past behaviour to evaluate the next move",
      excerpt: "A forecast becomes more useful when it is compared with the pace the market has actually been delivering.",
      sections: [
        ["A number without context is only an estimate", "A future odd can look precise simply because it is expressed as a number. HistoryOdd's Forecast Ruler begins with recent behaviour instead: how much the market moved, at what pace, and whether that pace could plausibly continue over the next intervals."],
        ["The forecast starts with what already happened", "Previous intervals reveal whether the market has been accelerating, slowing down, oscillating or following a relatively stable path. A useful projection should be read against that background rather than in isolation."],
        ["Why predicted versus actual matters", "As the match progresses, the projected odd can be compared with the price that was actually reached. This turns prediction into feedback: the user can see when the market followed the expected path and when its behaviour changed."],
        ["Deceleration and renewed momentum", "A market that paid strongly for two intervals and then slows down should not automatically be projected at the old pace. Conversely, a slow period followed by increasingly stronger intervals may support a more aggressive continuity scenario."],
        ["Treat the forecast as a scenario, not a destination", "Goals, red cards, liquidity shifts and sudden changes in market perception can invalidate previous patterns. The professional use of a forecast is therefore conditional: it describes what continuation could look like if the underlying behaviour remains relevant."],
      ],
    },
    es: {
      title: "Regla de Previsión: usar el comportamiento pasado para evaluar el próximo movimiento",
      excerpt: "Una proyección gana valor cuando se compara con el ritmo que el mercado realmente venía mostrando.",
      sections: [
        ["Predecir sin contexto es solo estimar", "Una cuota futura puede parecer precisa únicamente porque está expresada como un número. La Regla de Previsión parte del comportamiento reciente: cuánto pagó el mercado, a qué ritmo y cómo podría continuar esa dinámica."],
        ["La proyección comienza en el pasado", "Los intervalos anteriores ayudan a detectar aceleración, desaceleración, oscilación o continuidad. La previsión tiene más sentido cuando se interpreta dentro de ese patrón."],
        ["Previsto frente a realizado", "A medida que avanza el partido, la cuota proyectada puede compararse con la cuota real. Así es posible observar cuándo el mercado siguió el escenario esperado y cuándo cambió de comportamiento."],
        ["Desaceleración y recuperación de ritmo", "Si el mercado pagó fuerte y después pierde intensidad, proyectar la misma velocidad puede exagerar el movimiento. Si ocurre lo contrario, una proyección más agresiva puede tener más contexto."],
        ["La previsión es un escenario", "Goles, expulsiones, liquidez y cambios bruscos pueden romper cualquier patrón. Por eso la proyección debe leerse como un escenario condicionado, no como un destino obligatorio del precio."],
      ],
    },
  },
  "historyodd-movimento": {
    icon: Target,
    sourceUrl: "https://www.instagram.com/p/DdJiZZNDsid/",
    product: "HistoryOdd",
    pt: {
      title: "Movimento: ler a odd como um pêndulo, e não como um número parado",
      excerpt: "Aceleração, correção e lateralização fazem parte do mesmo ciclo. Veja como o componente Movimento resume esse comportamento para tornar a leitura mais rápida.",
      sections: [
        ["O mercado raramente anda em linha reta", "Uma odd pode cair durante vários segundos, respirar, corrigir parte do movimento e voltar a ganhar força. Quem observa apenas o preço final tende a enxergar essas fases como ruído. O componente Movimento do HistoryOdd tenta resolver justamente esse problema: transformar pequenas oscilações sucessivas em um estado de mercado mais fácil de interpretar."],
        ["A analogia do pêndulo", "Pense no preço como um pêndulo. Ele pode estar próximo do equilíbrio, ganhar velocidade em uma direção, ultrapassar o ponto de conforto e depois corrigir. Em outros momentos, perde energia e permanece lateral. Essa imagem ajuda a entender por que os estados Justo, Acelerou, Despencou, Correção e Lateralizou não são rótulos independentes, mas fases que podem se suceder."],
        ["Estado, duração e intensidade", "Saber que a odd acelerou é útil; saber há quanto tempo e com qual intensidade é mais útil ainda. Uma aceleração curta pode ser apenas um impulso. Uma aceleração sustentada, acompanhada por variação consistente, representa outro contexto. O componente combina essas dimensões para reduzir a necessidade de interpretar cada microvariação manualmente."],
        ["Correção não significa necessariamente reversão", "Um dos erros comuns é tratar qualquer movimento contrário como mudança completa de direção. Muitas vezes, a correção é apenas uma devolução parcial depois de uma queda ou alta mais forte. Observar o estado anterior, a duração e a magnitude ajuda a separar uma pausa natural de uma mudança estrutural no comportamento."],
        ["Lateralização também é informação", "Quando a odd deixa de entregar deslocamento relevante e começa a oscilar numa faixa estreita, isso não significa que 'nada está acontecendo'. Significa que o mercado entrou em equilíbrio temporário. Para algumas estratégias, esse estado é justamente o alerta de que a dinâmica anterior perdeu força."],
        ["Velocidade de leitura como vantagem operacional", "O Movimento não elimina a necessidade de contexto, mas reduz o tempo gasto tentando nomear mentalmente o que o preço está fazendo. Em mercados rápidos, essa economia cognitiva importa: em vez de reagir a cada tick, o trader pode avaliar se o estado atual combina com o restante da sua leitura."],
      ],
    },
    "pt-PT": {
      title: "Movimento: ler a odd como um pêndulo, e não como um número parado",
      excerpt: "Aceleração, correção e lateralização fazem parte do mesmo ciclo. Veja como o componente Movimento resume esse comportamento.",
      sections: [
        ["O mercado raramente se move em linha reta", "Uma odd pode cair, respirar, corrigir e voltar a ganhar força. O componente Movimento transforma estas pequenas oscilações sucessivas num estado de mercado mais simples de interpretar."],
        ["A analogia do pêndulo", "O preço pode estar em equilíbrio, ganhar velocidade, ultrapassar esse ponto e corrigir. Os estados Justo, Acelerou, Despencou, Correção e Lateralizou podem ser entendidos como fases de um mesmo ciclo."],
        ["Estado, duração e intensidade", "Uma aceleração muito curta não tem o mesmo significado de uma aceleração sustentada. Ao combinar estado, duração e intensidade, o HistoryOdd acrescenta contexto à classificação visual."],
        ["Correção não é obrigatoriamente reversão", "Um movimento contrário pode representar apenas uma devolução parcial. O estado anterior e a dimensão da variação ajudam a distinguir uma pausa natural de uma alteração estrutural."],
        ["Lateralização também comunica", "Oscilar numa faixa estreita indica equilíbrio temporário e possível perda de força do movimento anterior. Para determinadas estratégias, essa informação é tão relevante como uma aceleração."],
      ],
    },
    en: {
      title: "Movement: reading the odd like a pendulum instead of a static number",
      excerpt: "Acceleration, correction and sideways behaviour are parts of the same cycle. Learn how HistoryOdd summarises them into a faster market read.",
      sections: [
        ["Markets rarely move in straight lines", "An odd can fall, pause, retrace part of the move and then accelerate again. Looking only at the final price turns those phases into noise. HistoryOdd's Movement component converts successive micro-movements into a market state that is easier to read."],
        ["The pendulum analogy", "Think of price as a pendulum: it can sit near equilibrium, gain speed in one direction, stretch beyond a comfortable point and then correct. At other times it loses energy and moves sideways. Fair, Accelerated, Dropped, Correction and Sideways are therefore better understood as phases rather than isolated labels."],
        ["State, duration and intensity", "Knowing that a price accelerated is useful; knowing how long it has lasted and how intense the move has been adds another layer. A short burst and a sustained acceleration should not be interpreted in the same way."],
        ["A correction is not automatically a reversal", "A move in the opposite direction may simply be a partial retracement after a stronger impulse. Previous state, duration and magnitude help distinguish a normal correction from a deeper behavioural shift."],
        ["Sideways is information too", "When price begins to oscillate inside a narrow range, the market may have entered temporary balance. For some trading approaches, that loss of directional energy is itself the most important signal."],
      ],
    },
    es: {
      title: "Movimiento: leer la cuota como un péndulo y no como un número estático",
      excerpt: "Aceleración, corrección y lateralización forman parte del mismo ciclo. Descubre cómo HistoryOdd resume ese comportamiento.",
      sections: [
        ["El mercado rara vez avanza en línea recta", "Una cuota puede caer, detenerse, corregir y volver a ganar fuerza. El componente Movimiento transforma esas microvariaciones sucesivas en un estado más fácil de interpretar."],
        ["La analogía del péndulo", "El precio puede estar cerca del equilibrio, ganar velocidad, extenderse demasiado y luego corregir. Justo, Aceleró, Desplomó, Corrección y Lateral son fases que pueden sucederse dentro del mismo ciclo."],
        ["Estado, duración e intensidad", "Una aceleración breve no tiene el mismo significado que una aceleración sostenida. Combinar duración e intensidad añade contexto al estado visual."],
        ["Corrección no significa reversión", "Un movimiento contrario puede ser solo una devolución parcial. El estado anterior y la magnitud ayudan a distinguir una pausa normal de un cambio más profundo."],
        ["La lateralización también informa", "Oscilar dentro de un rango estrecho puede indicar equilibrio temporal y pérdida de energía del movimiento anterior. Para algunas estrategias, esa ausencia de dirección es una información clave."],
      ],
    },
  },
  "historyodd-grafico-fonte": {
    icon: BarChart3,
    sourceUrl: "https://www.instagram.com/p/DdHELz-DuG4/",
    product: "HistoryOdd",
    pt: {
      title: "Gráfico Fonte: por que o caminho da odd importa tanto quanto o preço atual",
      excerpt: "O gráfico transforma uma cotação isolada em uma sequência visual de decisões do mercado, permitindo estudar aceleração, correção e continuidade.",
      sections: [
        ["Uma odd é uma fotografia; o gráfico mostra o filme", "Olhar para 1.30 informa apenas onde o mercado está agora. Não mostra se a cotação veio de 1.60 em queda contínua, se ficou minutos travada em 1.31 ou se acabou de corrigir de 1.24. O Gráfico Fonte do HistoryOdd registra esse percurso para que a leitura deixe de depender apenas do último preço disponível."],
        ["Trajetória muda o significado do mesmo preço", "Imagine dois mercados cotados a 1.30. No primeiro, a odd vem caindo de forma constante e com pagamentos regulares. No segundo, caiu bruscamente, devolveu boa parte e voltou a 1.30. O número é o mesmo, mas o comportamento recente — e portanto o risco de interpretar continuidade — é diferente."],
        ["Percentual pago ajuda a medir a força", "O gráfico não serve apenas para desenhar uma linha de preços. Ao acompanhar os percentuais pagos ao longo do tempo, o trader consegue relacionar deslocamento e velocidade. Isso ajuda a identificar se uma mudança visualmente grande aconteceu de forma consistente ou em um impulso muito curto."],
        ["BACK e LAY ganham contexto histórico", "Sinais operacionais são mais úteis quando aparecem sobre uma trajetória conhecida. Um sinal de BACK depois de uma correção longa não tem o mesmo contexto que um sinal idêntico durante uma queda acelerada. O histórico visual ajuda a verificar o que ocorreu antes do ponto de decisão."],
        ["Rebobinar para entender, não para encontrar padrões perfeitos", "O passado pode ser revisto para estudar reações e reconhecer comportamentos recorrentes, mas não deve ser usado para assumir que o mercado repetirá exatamente a mesma sequência. O valor da função é permitir análise posterior e aprendizado sobre o caminho do preço."],
        ["Quando o gráfico se torna mais útil", "Ele ganha força quando combinado com componentes que resumem ritmo, movimento e referência de valor. O gráfico mostra a história; outros componentes ajudam a quantificá-la. Juntos, eles reduzem a dependência de uma leitura puramente visual ou intuitiva."],
      ],
    },
    "pt-PT": {
      title: "Gráfico Fonte: porque o percurso da odd importa tanto como o preço atual",
      excerpt: "O gráfico transforma uma cotação isolada numa sequência visual de decisões do mercado, ajudando a estudar aceleração, correção e continuidade.",
      sections: [
        ["Uma odd é uma fotografia", "Ver 1.30 mostra apenas onde o mercado está. Não explica se a odd veio de 1.60 numa queda contínua, se esteve parada ou se acabou de corrigir. O Gráfico Fonte regista esse percurso."],
        ["O mesmo preço pode contar histórias diferentes", "Dois mercados em 1.30 podem ter dinâmicas opostas. Um pode estar numa queda estável; outro pode ter acabado de recuperar de uma oscilação forte. A trajetória muda a interpretação."],
        ["Percentagem paga mede intensidade", "Ao acompanhar a percentagem paga ao longo do tempo, torna-se possível relacionar deslocamento e velocidade e perceber se um movimento foi sustentado ou apenas um impulso curto."],
        ["Sinais BACK e LAY com histórico", "Um sinal operacional ganha mais significado quando é lido sobre o percurso anterior do preço. O histórico ajuda a perceber em que fase do movimento aquele sinal apareceu."],
        ["Rever para aprender", "O gráfico permite estudar reações passadas sem assumir que o mercado repetirá exatamente o mesmo padrão. O objetivo é construir contexto, não encontrar uma sequência infalível."],
      ],
    },
    en: {
      title: "Source Chart: why the path of an odd matters as much as its current price",
      excerpt: "The chart turns a single quote into a visual sequence of market decisions, making acceleration, correction and continuity easier to study.",
      sections: [
        ["An odd is a snapshot; a chart shows the movie", "Seeing 1.30 only tells you where the market is now. It does not show whether the price fell steadily from 1.60, stayed pinned near 1.31 or just rebounded from 1.24. HistoryOdd's Source Chart records that path."],
        ["The same price can carry a different story", "Two markets priced at 1.30 may have completely different dynamics. One may be in a stable decline while the other has just recovered from a sharp correction. The final number is identical; the recent behaviour is not."],
        ["Percentage paid adds a measure of force", "The chart is not only a price line. Tracking percentage movement over time helps connect distance with speed and distinguish sustained behaviour from a short-lived impulse."],
        ["BACK and LAY signals need history", "An operational signal becomes more informative when it is placed over a known trajectory. The same BACK signal after a long correction and during a fast decline should not automatically be read in the same way."],
        ["Rewind to learn, not to find perfect patterns", "Reviewing past movement can help identify reactions and recurring structures, but it should not be used to assume the next sequence will repeat exactly. The value lies in study and context."],
      ],
    },
    es: {
      title: "Gráfico Fuente: por qué el recorrido de la cuota importa tanto como el precio actual",
      excerpt: "El gráfico convierte una cotización aislada en una secuencia visual de decisiones del mercado para estudiar aceleración, corrección y continuidad.",
      sections: [
        ["Una cuota es una fotografía", "Ver 1.30 solo muestra dónde está el mercado ahora. No explica si llegó desde 1.60 con una caída continua, si permaneció estable o si acaba de corregir desde 1.24. El Gráfico Fuente registra ese recorrido."],
        ["El mismo precio puede tener historias distintas", "Dos mercados en 1.30 pueden mostrar dinámicas opuestas. Uno puede caer de forma constante y otro estar recuperándose de una oscilación fuerte. La trayectoria cambia la lectura."],
        ["El porcentaje pagado mide intensidad", "Seguir el porcentaje de movimiento a lo largo del tiempo permite relacionar desplazamiento y velocidad y distinguir un comportamiento sostenido de un impulso corto."],
        ["Señales BACK y LAY con contexto", "Una señal operativa es más útil cuando aparece sobre una trayectoria conocida. El histórico ayuda a entender en qué fase del movimiento surgió."],
        ["Rebobinar para aprender", "Revisar movimientos anteriores sirve para estudiar reacciones y patrones, no para asumir que el mercado repetirá exactamente la misma secuencia."],
      ],
    },
  },
  "historyodd-margem": {
    icon: Scale,
    sourceUrl: "https://www.instagram.com/p/DdG2n-1Dkz6/",
    product: "HistoryOdd",
    pt: {
      title: "Margem: quando preço de mercado e referência de valor deixam de ser a mesma coisa",
      excerpt: "Comparar odd atual, odd justa e outras referências ajuda a enxergar discrepâncias que não aparecem quando o preço é analisado sozinho.",
      sections: [
        ["Preço e valor são conceitos diferentes", "A odd disponível mostra o preço ao qual o mercado negocia naquele instante. Ela não responde, sozinha, se esse preço é alto, baixo ou adequado. Para fazer essa avaliação é necessário algum referencial. O componente Margem do HistoryOdd reúne diferentes referências na mesma leitura para tornar essa comparação explícita."],
        ["Por que colocar várias odds lado a lado", "Bet365, odd justa, odd de fecho, próxima justa e odd atual representam perspectivas diferentes sobre o mesmo mercado. Nenhuma precisa ser tratada como verdade absoluta. O objetivo é observar a distância entre elas e identificar quando o preço disponível se afasta do conjunto de referências que o trader acompanha."],
        ["A diferença só ganha sentido quando existe um modelo", "Se a odd atual está em 1.46 e a referência justa está em 1.52, existe uma diferença mensurável. Mas essa diferença não é automaticamente uma oportunidade. Tudo depende da qualidade do cálculo da odd justa, do momento do jogo e das premissas utilizadas. A margem ajuda a quantificar a discrepância; não elimina a necessidade de validar a referência."],
        ["Odd de fecho e próxima justa acrescentam perspectiva", "Uma referência de fecho ajuda a visualizar um ponto intermediário entre o preço atual e o valor considerado justo, enquanto a próxima justa permite observar para onde esse referencial pode se deslocar. Isso é particularmente útil em mercados em que o tempo provoca alteração contínua do preço."],
        ["EV+ não significa acertar sempre", "O conceito de valor esperado positivo está ligado à qualidade média das decisões, não à certeza de um resultado individual. Mesmo uma decisão tomada a um preço considerado vantajoso pode terminar em perda. Por isso, margem e gestão de risco precisam andar juntas."],
        ["O uso mais útil da Margem", "O componente funciona melhor como uma camada de validação. O trader identifica o movimento, entende o ritmo, observa o contexto da partida e então verifica se o preço disponível está coerente com suas referências. Em vez de perguntar apenas 'a odd está baixa?', a pergunta passa a ser 'baixa em relação a quê?'."],
      ],
    },
    "pt-PT": {
      title: "Margem: quando preço de mercado e referência de valor deixam de ser a mesma coisa",
      excerpt: "Comparar odd atual, odd justa e outras referências ajuda a identificar discrepâncias que não são visíveis quando o preço é analisado isoladamente.",
      sections: [
        ["Preço e valor são conceitos diferentes", "A odd disponível mostra o preço de mercado naquele momento, mas não indica sozinha se esse preço é adequado. Para avaliar valor é necessário um referencial. O componente Margem coloca várias referências lado a lado."],
        ["Porque comparar várias odds", "Bet365, odd justa, odd de fecho, próxima justa e odd atual representam perspetivas diferentes. O objetivo não é declarar uma delas como verdade absoluta, mas medir a distância entre preço e referências."],
        ["Uma diferença só vale tanto como o modelo", "Se a odd atual é 1.46 e a referência justa 1.52, existe uma discrepância. Isso não significa automaticamente oportunidade: a qualidade do cálculo e o contexto continuam a ser essenciais."],
        ["Fecho e próxima justa acrescentam contexto", "Estas referências ajudam a observar o deslocamento esperado do preço ao longo do tempo e a comparar o mercado atual com pontos intermediários."],
        ["EV+ não significa acertar sempre", "Valor esperado positivo refere-se à qualidade média das decisões, não à garantia de um resultado individual. Margem e gestão de risco devem ser analisadas em conjunto."],
      ],
    },
    en: {
      title: "Margin: when market price and value reference stop being the same thing",
      excerpt: "Comparing the current odd with fair-price references can expose discrepancies that remain invisible when price is viewed alone.",
      sections: [
        ["Price and value are different concepts", "The available odd tells you the market price at that moment. It does not tell you by itself whether that price is high, low or appropriate. A value judgement requires a reference, and HistoryOdd's Margin component places several such references in the same view."],
        ["Why compare several prices", "Bet365, fair odd, closing reference, next fair odd and current odd represent different perspectives on the same market. None has to be treated as absolute truth. The purpose is to observe the distance between them."],
        ["A discrepancy is only as useful as the model behind it", "If the current odd is 1.46 and a fair reference is 1.52, the gap can be measured. That does not automatically make it an opportunity. The quality of the fair-price calculation, timing and assumptions still matter."],
        ["Closing and next-fair references add perspective", "These additional points help frame how the reference price may evolve in a time-sensitive market and make it easier to compare the current quote with an expected path."],
        ["Positive EV does not mean winning every trade", "Expected value describes the average quality of decisions over time, not certainty on an individual outcome. Price advantage and risk management therefore need to be considered together."],
      ],
    },
    es: {
      title: "Margen: cuando precio de mercado y referencia de valor dejan de ser lo mismo",
      excerpt: "Comparar la cuota actual con referencias de precio justo ayuda a detectar diferencias que no aparecen al mirar el precio de forma aislada.",
      sections: [
        ["Precio y valor son conceptos distintos", "La cuota disponible muestra el precio de mercado en ese instante, pero no dice por sí sola si es alta, baja o adecuada. Para hablar de valor hace falta una referencia. El componente Margen reúne varias en una misma lectura."],
        ["Por qué comparar varias cuotas", "Bet365, cuota justa, referencia de cierre, próxima justa y cuota actual representan perspectivas distintas. El objetivo es observar la distancia entre ellas, no declarar una como verdad absoluta."],
        ["Una diferencia depende del modelo", "Si la cuota actual es 1.46 y la referencia justa 1.52, existe una discrepancia medible. Eso no implica automáticamente una oportunidad: importa la calidad del cálculo, el momento y las premisas."],
        ["Cierre y próxima justa aportan perspectiva", "Estas referencias ayudan a observar cómo podría desplazarse el precio a medida que avanza el tiempo y a comparar el mercado actual con puntos intermedios."],
        ["EV+ no significa acertar siempre", "El valor esperado positivo se refiere a la calidad media de las decisiones, no a la certeza de cada resultado. Margen y gestión de riesgo deben analizarse juntas."],
      ],
    },
  },

  "ao-do-sucesso": {
    icon: Target,
    pt: {
      title: "O ÃO do Sucesso",
      excerpt: "Preparação, Seleção, Atenção, Gestão e Execução: cinco etapas simples de entender, difíceis de manter e essenciais para construir um processo responsável no trading esportivo.",
      sections: [
        ["Preparação — o ÃO menos falado", "Antes de pensar em mercado, pense em você. Dormir bem, manter uma rotina de exercícios físicos e cuidar da sua condição mental fazem parte da preparação tanto quanto abrir gráficos e organizar ferramentas. Problemas pessoais, cansaço e estresse não desaparecem quando o jogo começa; eles podem alterar sua percepção, reduzir sua paciência e piorar decisões que normalmente seriam simples. Seu ambiente também precisa estar pronto: layout organizado, ferramentas configuradas, conexão estável e tudo que você precisa acessível antes da operação. Preparação não garante resultado, mas reduz erros evitáveis. Se você começa desorganizado, já começa tendo que lutar contra você mesmo antes de lidar com o mercado."],
        ["Seleção — o ÃO mais subestimado", "Nem todo jogo precisa ser operado. Selecionar bem significa escolher partidas que realmente atendam aos critérios do seu método, e não adaptar o método porque você quer entrar em determinado jogo. Defina previamente o que precisa existir para um jogo entrar na sua lista: contexto, mercado, faixa de odd, comportamento esperado, dados e qualquer outro filtro que faça parte do seu processo. Quanto mais clara for a seleção, menos decisões emocionais você precisará tomar depois. Muitas vezes, uma boa sessão não é aquela em que você encontrou muitas entradas, mas aquela em que descartou corretamente tudo que não deveria operar."],
        ["Atenção — o ÃO que deve estar em todos os processos", "Quando estiver operando, esteja realmente operando. Redes sociais, mensagens, problemas paralelos, várias telas sem necessidade ou qualquer coisa que dispute sua atenção aumenta a chance de você enxergar o mercado tarde demais ou interpretar um movimento de forma incompleta. Atenção não significa tensão constante; significa presença. Você precisa saber o que está acompanhando, por que está acompanhando e o que faria você agir ou ficar de fora. Quanto menos ruído competir com o seu foco, maior a chance de executar o processo que você planejou em vez de reagir por impulso."],
        ["Gestão — o ÃO que te mantém vivo no game", "O óbvio precisa ser dito: nada dos passos anteriores sustenta uma operação sem gestão. O mercado não sabe quem você é, não conhece sua sequência anterior e não está preocupado em devolver um RED. Por isso, stake, responsabilidade, limite de perda e exposição precisam estar definidos antes da entrada. Se um RED faz você aumentar risco, perseguir prejuízo ou abandonar sua própria regra, o problema deixou de ser o mercado e passou a ser o processo. Nesse momento, a resposta responsável é interromper, reavaliar e recomeçar o ciclo pela preparação antes de continuar. Gestão não existe para impedir perdas; existe para impedir que uma perda normal se transforme em um problema muito maior."],
        ["Execução — o ÃO que transforma processo em resultado", "Com tudo pronto, chega a hora de ler o jogo e o mercado ao mesmo tempo. Uma boa oportunidade precisa fazer sentido dentro do seu método, do comportamento do preço e do que está acontecendo na partida. Aprenda também a reconhecer armadilhas. Quando parecer que somente você está vendo uma oportunidade extraordinária, vale redobrar a análise: o mercado reúne muita informação, participantes e dinheiro, e ir contra ele apenas por convicção pessoal tende a ser uma decisão frágil quando não existe evidência suficiente. Executar bem não é clicar rápido nem tentar acertar todos os movimentos; é agir quando os critérios aparecem e aceitar ficar de fora quando eles não aparecem."],
        ["O ciclo vale mais que uma entrada", "Preparação, Seleção, Atenção, Gestão e Execução não são etapas isoladas. Elas formam um ciclo. Uma execução ruim pode nascer de uma seleção ruim; uma seleção ruim pode nascer de falta de atenção; e uma quebra de gestão pode revelar que sua preparação mental já não estava boa. O objetivo não é buscar perfeição, mas construir um processo repetível e responsável. No trading esportivo, sobreviver ao longo do tempo depende menos de uma grande entrada e mais da capacidade de repetir boas decisões, limitar erros e reconhecer quando é melhor não operar."],
      ],
    },
    "pt-PT": {
      title: "O ÃO do Sucesso",
      excerpt: "Preparação, Seleção, Atenção, Gestão e Execução: cinco etapas simples de compreender, difíceis de manter e essenciais para construir um processo responsável no trading desportivo.",
      sections: [
        ["Preparação — o ÃO menos falado", "Antes de pensar no mercado, pense em si. Dormir bem, manter uma rotina de exercício físico e cuidar da sua condição mental fazem parte da preparação tanto como abrir gráficos e organizar ferramentas. Problemas pessoais, cansaço e stress não desaparecem quando o jogo começa; podem alterar a perceção, reduzir a paciência e piorar decisões que normalmente seriam simples. O ambiente também deve estar pronto: layout organizado, ferramentas configuradas, ligação estável e tudo o que precisa acessível antes da operação. A preparação não garante resultados, mas reduz erros evitáveis."],
        ["Seleção — o ÃO mais subestimado", "Nem todos os jogos precisam de ser operados. Selecionar bem significa escolher partidas que realmente cumprem os critérios do seu método, em vez de adaptar o método porque quer entrar num determinado jogo. Defina antecipadamente o que tem de existir para uma partida entrar na sua lista: contexto, mercado, faixa de odd, comportamento esperado, dados e outros filtros do seu processo. Muitas vezes, uma boa sessão é aquela em que conseguiu excluir corretamente aquilo que não deveria operar."],
        ["Atenção — o ÃO que deve estar em todos os processos", "Quando estiver a operar, esteja realmente focado na operação. Redes sociais, mensagens, problemas paralelos, demasiados ecrãs sem necessidade ou qualquer coisa que dispute a sua atenção aumenta a probabilidade de perceber o mercado tarde demais ou interpretar um movimento de forma incompleta. Atenção não significa tensão constante; significa presença. Deve saber o que acompanha, por que o acompanha e o que o faria agir ou ficar de fora."],
        ["Gestão — o ÃO que o mantém vivo no game", "O óbvio precisa de ser dito: nenhum dos passos anteriores sustenta uma operação sem gestão. O mercado não sabe quem é, não conhece a sua sequência anterior e não está preocupado em devolver um RED. Stake, responsabilidade, limite de perda e exposição devem estar definidos antes da entrada. Se um RED o leva a aumentar o risco, perseguir prejuízos ou abandonar as suas próprias regras, deve interromper, reavaliar e recomeçar o ciclo pela preparação. A gestão não existe para impedir perdas; existe para impedir que uma perda normal se transforme num problema muito maior."],
        ["Execução — o ÃO que transforma processo em resultado", "Com tudo preparado, chega a hora de ler o jogo e o mercado ao mesmo tempo. Uma boa oportunidade deve fazer sentido dentro do seu método, do comportamento do preço e do que acontece na partida. Quando parecer que apenas você está a ver uma oportunidade extraordinária, reforce a análise: o mercado reúne muita informação, participantes e dinheiro, e contrariá-lo apenas por convicção pessoal é uma decisão frágil quando não existe evidência suficiente. Executar bem é agir quando os critérios aparecem e aceitar ficar de fora quando não aparecem."],
        ["O ciclo vale mais do que uma entrada", "Preparação, Seleção, Atenção, Gestão e Execução formam um ciclo. Uma execução fraca pode nascer de uma má seleção; uma má seleção pode nascer de falta de atenção; e uma quebra de gestão pode mostrar que a preparação mental já não estava adequada. O objetivo não é procurar perfeição, mas construir um processo repetível e responsável. No trading desportivo, a consistência depende mais da capacidade de repetir boas decisões, limitar erros e reconhecer quando é melhor não operar do que de uma única grande entrada."],
      ],
    },
    en: {
      title: "The Success Cycle",
      excerpt: "Preparation, Selection, Attention, Management and Execution: five simple stages that are difficult to maintain consistently and essential to a responsible sports-trading process.",
      sections: [
        ["Preparation — the least discussed stage", "Before thinking about the market, think about yourself. Good sleep, regular physical exercise and a healthy mental state are part of preparation just as much as opening charts and organising tools. Personal problems, fatigue and stress do not disappear when a match starts; they can change your perception, reduce patience and make normally simple decisions harder. Your environment should also be ready: an organised layout, configured tools, a stable connection and everything you need available before you trade. Preparation does not guarantee results, but it reduces avoidable mistakes."],
        ["Selection — the most underestimated stage", "Not every match needs to be traded. Good selection means choosing matches that genuinely meet your method's criteria instead of changing the method because you want action in a particular game. Define in advance what must be present for a match to enter your shortlist: context, market, price range, expected behaviour, data and any other filter in your process. A good session is not necessarily one with many entries; sometimes it is the session in which you correctly rejected everything that did not deserve a trade."],
        ["Attention — the stage that belongs in every process", "When you are trading, be fully engaged with what you are doing. Social media, messages, personal issues, unnecessary screens or anything else competing for your attention increases the chance of reading the market late or interpreting a move with incomplete information. Attention does not mean constant tension; it means presence. Know what you are watching, why you are watching it and what would make you act or stay out."],
        ["Management — the stage that keeps you in the game", "The obvious needs to be said: none of the previous stages can protect your process without risk management. The market does not know who you are, does not care about your previous sequence and is not trying to give a loss back to you. Stake, liability, loss limits and exposure should be defined before entry. If one loss makes you increase risk, chase money or abandon your own rules, stop, reassess and restart the cycle from preparation before continuing. Risk management is not designed to eliminate losses; it is designed to prevent a normal loss from becoming a much larger problem."],
        ["Execution — the stage that turns process into results", "Once everything is ready, you need to read the match and the market together. A good opportunity should make sense within your method, price behaviour and what is actually happening in the game. Be cautious when it feels as though only you can see an extraordinary opportunity: markets combine a large amount of information, participants and money, and opposing them purely on personal conviction is fragile when the evidence is weak. Good execution is not about clicking quickly or catching every move; it is acting when your criteria are present and accepting no trade when they are not."],
        ["The cycle matters more than one trade", "Preparation, Selection, Attention, Management and Execution are not isolated steps. They form a cycle. Poor execution can begin with poor selection; poor selection can come from weak attention; and a management breach may reveal that your mental preparation was already compromised. The goal is not perfection. It is to build a repeatable, responsible process. In sports trading, long-term survival depends less on one great trade and more on repeatedly making sound decisions, limiting mistakes and recognising when the best decision is not to trade."],
      ],
    },
    es: {
      title: "Los CIÓN del Éxito",
      excerpt: "Preparación, Selección, Atención, Gestión y Ejecución: cinco etapas fáciles de entender, difíciles de mantener y esenciales para construir un proceso responsable en el trading deportivo.",
      sections: [
        ["Preparación — el CIÓN del que menos se habla", "Antes de pensar en el mercado, piensa en ti. Dormir bien, mantener una rutina de ejercicio físico y cuidar tu estado mental forman parte de la preparación tanto como abrir gráficos y organizar herramientas. Los problemas personales, el cansancio y el estrés no desaparecen cuando empieza el partido; pueden alterar tu percepción, reducir tu paciencia y empeorar decisiones que normalmente serían simples. Tu entorno también debe estar listo: layout organizado, herramientas configuradas, conexión estable y todo lo necesario disponible antes de operar. La preparación no garantiza resultados, pero reduce errores evitables."],
        ["Selección — el CIÓN más subestimado", "No todos los partidos tienen que ser operados. Seleccionar bien significa elegir encuentros que realmente cumplen los criterios de tu método, en lugar de adaptar el método porque quieres entrar en un partido concreto. Define previamente qué debe existir para que un partido llegue a tu lista: contexto, mercado, rango de cuota, comportamiento esperado, datos y cualquier otro filtro de tu proceso. Muchas veces una buena sesión no es aquella con muchas entradas, sino aquella en la que descartaste correctamente lo que no debías operar."],
        ["Atención — el CIÓN que debe estar en todos los procesos", "Cuando estés operando, céntrate realmente en la operación. Redes sociales, mensajes, problemas paralelos, pantallas innecesarias o cualquier cosa que compita por tu atención aumenta la posibilidad de leer el mercado tarde o interpretar un movimiento con información incompleta. Atención no significa tensión constante; significa presencia. Debes saber qué estás observando, por qué lo observas y qué tendría que ocurrir para actuar o quedarte fuera."],
        ["Gestión — el CIÓN que te mantiene vivo en el game", "Hay que decir lo obvio: ninguno de los pasos anteriores sostiene una operación sin gestión. El mercado no sabe quién eres, no conoce tu secuencia anterior y no está preocupado por devolverte un RED. Stake, responsabilidad, límite de pérdida y exposición deben estar definidos antes de entrar. Si un RED hace que aumentes el riesgo, persigas pérdidas o abandones tus propias reglas, detente, reevalúa y reinicia el ciclo desde la preparación antes de continuar. La gestión no existe para evitar todas las pérdidas; existe para impedir que una pérdida normal se convierta en un problema mucho mayor."],
        ["Ejecución — el CIÓN que transforma el proceso en resultado", "Con todo preparado, llega el momento de leer el partido y el mercado al mismo tiempo. Una buena oportunidad debe tener sentido dentro de tu método, del comportamiento del precio y de lo que ocurre en el juego. Desconfía cuando parezca que solo tú estás viendo una oportunidad extraordinaria: el mercado reúne mucha información, participantes y dinero, y enfrentarse a él solo por convicción personal es una decisión débil cuando no hay evidencia suficiente. Ejecutar bien es actuar cuando aparecen tus criterios y aceptar quedarse fuera cuando no aparecen."],
        ["El ciclo vale más que una entrada", "Preparación, Selección, Atención, Gestión y Ejecución no son etapas aisladas. Forman un ciclo. Una mala ejecución puede nacer de una mala selección; una mala selección puede nacer de falta de atención; y una ruptura de gestión puede revelar que tu preparación mental ya no era adecuada. El objetivo no es buscar perfección, sino construir un proceso repetible y responsable. En el trading deportivo, mantenerse a largo plazo depende menos de una gran entrada y más de repetir buenas decisiones, limitar errores y reconocer cuándo es mejor no operar."],
      ],
    },
  },

};

const getLang = (language) => copy[language] ? language : "pt";

const socialCopy = {
  pt: {
    reads: "leituras",
    oneRead: "leitura",
    rating: "Avaliação",
    ratings: "avaliações",
    oneRating: "avaliação",
    yourRating: "Sua avaliação",
    rateThis: "Avalie este conteúdo",
    rateHint: "Clique de 1 a 5 estrelas. Você pode alterar sua nota depois.",
    loginToRate: "Entre na sua conta para avaliar este conteúdo.",
    login: "Entrar para avaliar",
    saved: "Sua avaliação foi salva.",
    saveError: "Não foi possível salvar sua avaliação agora.",
    mostRead: "Mais lidos",
    mostReadText: "Conteúdos ordenados pelo número de leituras.",
    bestRated: "Melhores avaliados",
    bestRatedText: "Maior média primeiro. Em caso de empate, vence o conteúdo com mais leituras.",
    noRatings: "Ainda sem avaliações",
    community: "Ranking da comunidade",
  },
  "pt-PT": {
    reads: "leituras",
    oneRead: "leitura",
    rating: "Avaliação",
    ratings: "avaliações",
    oneRating: "avaliação",
    yourRating: "A sua avaliação",
    rateThis: "Avalie este conteúdo",
    rateHint: "Clique de 1 a 5 estrelas. Pode alterar a sua nota depois.",
    loginToRate: "Entre na sua conta para avaliar este conteúdo.",
    login: "Entrar para avaliar",
    saved: "A sua avaliação foi guardada.",
    saveError: "Não foi possível guardar a sua avaliação agora.",
    mostRead: "Mais lidos",
    mostReadText: "Conteúdos ordenados pelo número de leituras.",
    bestRated: "Melhores avaliados",
    bestRatedText: "Maior média primeiro. Em caso de empate, fica à frente o conteúdo com mais leituras.",
    noRatings: "Ainda sem avaliações",
    community: "Ranking da comunidade",
  },
  en: {
    reads: "reads",
    oneRead: "read",
    rating: "Rating",
    ratings: "ratings",
    oneRating: "rating",
    yourRating: "Your rating",
    rateThis: "Rate this guide",
    rateHint: "Choose from 1 to 5 stars. You can change your rating later.",
    loginToRate: "Sign in to rate this guide.",
    login: "Sign in to rate",
    saved: "Your rating has been saved.",
    saveError: "Your rating could not be saved right now.",
    mostRead: "Most read",
    mostReadText: "Guides ranked by total reads.",
    bestRated: "Top rated",
    bestRatedText: "Highest average first. Ties are broken by the number of reads.",
    noRatings: "No ratings yet",
    community: "Community rankings",
  },
  es: {
    reads: "lecturas",
    oneRead: "lectura",
    rating: "Valoración",
    ratings: "valoraciones",
    oneRating: "valoración",
    yourRating: "Tu valoración",
    rateThis: "Valora este contenido",
    rateHint: "Elige de 1 a 5 estrellas. Puedes cambiar tu nota después.",
    loginToRate: "Inicia sesión para valorar este contenido.",
    login: "Entrar para valorar",
    saved: "Tu valoración se ha guardado.",
    saveError: "No fue posible guardar tu valoración ahora.",
    mostRead: "Más leídos",
    mostReadText: "Contenidos ordenados por número de lecturas.",
    bestRated: "Mejor valorados",
    bestRatedText: "Mayor media primero. En caso de empate, queda delante el contenido con más lecturas.",
    noRatings: "Aún sin valoraciones",
    community: "Ranking de la comunidad",
  },
};

const formatNumber = (value, language) =>
  new Intl.NumberFormat(language === "pt" ? "pt-BR" : language).format(Number(value || 0));

const getStats = (stats, slug) => {
  const item = stats?.[slug] || {};
  const views = Number(item.views || 0);
  const ratingTotal = Number(item.ratingTotal || 0);
  const ratingCount = Number(item.ratingCount || 0);
  return {
    views,
    ratingTotal,
    ratingCount,
    average: ratingCount > 0 ? ratingTotal / ratingCount : 0,
  };
};

function ArticleStats({ stats, language, compact = false }) {
  const labels = socialCopy[language] || socialCopy.pt;
  const readLabel = stats.views === 1 ? labels.oneRead : labels.reads;
  const ratingLabel = stats.ratingCount === 1 ? labels.oneRating : labels.ratings;

  return (
    <div className={`blog-stats${compact ? " compact" : ""}`}>
      <span><Eye size={compact ? 14 : 16} /> {formatNumber(stats.views, language)} {readLabel}</span>
      <span className={stats.ratingCount ? "has-rating" : ""}>
        <Star size={compact ? 14 : 16} fill={stats.ratingCount ? "currentColor" : "none"} />
        {stats.ratingCount ? `${stats.average.toFixed(1)} · ${formatNumber(stats.ratingCount, language)} ${ratingLabel}` : labels.noRatings}
      </span>
    </div>
  );
}

export default function BlogPage({ language = "pt", slug = "", authUser = null, onRequestLogin }) {
  const lang = getLang(language);
  const ui = copy[lang];
  const labels = socialCopy[lang] || socialCopy.pt;
  const articleRoot = slug ? articles[slug] : null;
  const article = articleRoot?.[lang] || null;
  const [statsBySlug, setStatsBySlug] = useState({});
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  useEffect(() => observeBlogStats(setStatsBySlug), []);

  useEffect(() => {
    if (!slug || !article) return undefined;
    const storageKey = `tradertab-blog-read:${slug}`;
    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(storageKey) === "1";
    } catch {
      alreadyCounted = false;
    }
    if (alreadyCounted) return undefined;

    const timer = window.setTimeout(() => {
      incrementBlogView(slug)
        .then(() => {
          try { sessionStorage.setItem(storageKey, "1"); } catch { /* sem storage */ }
        })
        .catch((error) => console.warn("[TraderTab] Falha ao contabilizar leitura.", error));
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [article, slug]);

  useEffect(() => {
    let active = true;
    setMyRating(0);
    setRatingMessage("");
    if (!authUser?.uid || !slug) return () => { active = false; };

    loadArticleRating(authUser.uid, slug)
      .then((value) => { if (active) setMyRating(value); })
      .catch((error) => console.warn("[TraderTab] Falha ao carregar avaliação do conteúdo.", error));

    return () => { active = false; };
  }, [authUser?.uid, slug]);

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const description = article?.excerpt || ui.hubIntro;
    document.title = article ? `${article.title} | TraderTab` : `${ui.hubTitle} | TraderTab`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
    return () => {
      document.title = previousTitle;
      meta?.setAttribute("content", previousDescription);
    };
  }, [article, ui.hubIntro, ui.hubTitle]);

  const rankings = useMemo(() => {
    const rows = Object.entries(articles).map(([articleSlug, translations]) => ({
      slug: articleSlug,
      title: translations[lang].title,
      ...getStats(statsBySlug, articleSlug),
    }));

    const mostRead = [...rows]
      .sort((a, b) => b.views - a.views || b.average - a.average || a.title.localeCompare(b.title))
      .slice(0, 5);
    const bestRated = rows
      .filter((row) => row.ratingCount > 0)
      .sort((a, b) => b.average - a.average || b.views - a.views || a.title.localeCompare(b.title))
      .slice(0, 5);
    return { mostRead, bestRated };
  }, [lang, statsBySlug]);

  const submitRating = async (value) => {
    if (!authUser?.uid) {
      onRequestLogin?.();
      return;
    }
    if (ratingBusy) return;
    setRatingBusy(true);
    setRatingMessage("");
    try {
      await saveArticleRating(authUser.uid, slug, value);
      setMyRating(value);
      setRatingMessage(labels.saved);
    } catch (error) {
      console.warn("[TraderTab] Falha ao salvar avaliação.", error);
      setRatingMessage(labels.saveError);
    } finally {
      setRatingBusy(false);
    }
  };

  if (slug && !article) {
    return <main className="blog-shell"><div className="blog-empty"><h1>404</h1><a href="/blog">{ui.back}</a></div></main>;
  }

  if (article) {
    const articleStats = getStats(statsBySlug, slug);
    const displayedRating = hoverRating || myRating;
    return (
      <main className="blog-shell">
        <article className="blog-article">
          <a className="blog-back" href="/blog"><ArrowLeft size={16} /> {ui.back}</a>
          <div className="blog-article-kicker"><BookOpen size={17} /> {articleRoot?.product ? `${articleRoot.product} Guide` : "TraderTab Guide"}</div>
          <h1>{article.title}</h1>
          <p className="blog-lead">{article.excerpt}</p>
          <div className="blog-article-meta">
            <p className="blog-updated">{ui.updated}</p>
            <ArticleStats stats={articleStats} language={lang} />
          </div>
          {article.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}

          <section className="blog-rating-box" aria-label={labels.rating}>
            <div>
              <span className="blog-rating-eyebrow"><Star size={17} /> {labels.rateThis}</span>
              <strong>{myRating ? `${labels.yourRating}: ${myRating}/5` : labels.rating}</strong>
              <p>{authUser ? labels.rateHint : labels.loginToRate}</p>
            </div>
            <div className="blog-rating-actions">
              <div className="blog-stars" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value <= displayedRating ? "active" : ""}
                    aria-label={`${value} / 5`}
                    title={`${value} / 5`}
                    disabled={ratingBusy}
                    onMouseEnter={() => setHoverRating(value)}
                    onFocus={() => setHoverRating(value)}
                    onBlur={() => setHoverRating(0)}
                    onClick={() => submitRating(value)}
                  >
                    <Star size={26} fill={value <= displayedRating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              {!authUser && <button type="button" className="blog-login-rate" onClick={() => onRequestLogin?.()}>{labels.login}</button>}
              {ratingMessage && <span className="blog-rating-message">{ratingMessage}</span>}
            </div>
          </section>

          {articleRoot?.sourceUrl && <a className="blog-instagram-link" href={articleRoot.sourceUrl} target="_blank" rel="noreferrer">{ui.instagram} <ArrowRight size={15} /></a>}
          <div className="blog-disclaimer">{ui.disclaimer}</div>
        </article>
      </main>
    );
  }

  const renderRanking = (items, type) => (
    <div className="blog-ranking-card">
      <div className="blog-ranking-head">
        <span className="blog-ranking-icon"><Trophy size={18} /></span>
        <div>
          <h2>{type === "views" ? labels.mostRead : labels.bestRated}</h2>
          <p>{type === "views" ? labels.mostReadText : labels.bestRatedText}</p>
        </div>
      </div>
      <div className="blog-ranking-list">
        {items.length ? items.map((item, index) => (
          <a key={item.slug} href={`/blog/${item.slug}`} className="blog-ranking-row">
            <strong className="blog-ranking-position">{index + 1}</strong>
            <span className="blog-ranking-title">{item.title}</span>
            <span className="blog-ranking-value">
              {type === "views"
                ? <><Eye size={14} /> {formatNumber(item.views, lang)}</>
                : <><Star size={14} fill="currentColor" /> {item.average.toFixed(1)} <small>· {formatNumber(item.views, lang)} <Eye size={11} /></small></>}
            </span>
          </a>
        )) : <div className="blog-ranking-empty">{labels.noRatings}</div>}
      </div>
    </div>
  );

  return (
    <main className="blog-shell">
      <section className="blog-hero">
        <span><BookOpen size={18} /> TraderTab Academy</span>
        <h1>{ui.hubTitle}</h1>
        <p>{ui.hubIntro}</p>
      </section>

      <section className="blog-community-section">
        <div className="blog-community-title"><Trophy size={20} /><h2>{labels.community}</h2></div>
        <div className="blog-ranking-grid">
          {renderRanking(rankings.mostRead, "views")}
          {renderRanking(rankings.bestRated, "rating")}
        </div>
      </section>

      <section className="blog-grid">
        {Object.entries(articles).map(([articleSlug, translations]) => {
          const item = translations[lang];
          const Icon = translations.icon || BookOpen;
          const stats = getStats(statsBySlug, articleSlug);
          return <a className="blog-card" key={articleSlug} href={`/blog/${articleSlug}`}>
            <div className="blog-card-icon"><Icon size={23} /></div>
            <h2>{item.title}</h2>
            <p>{item.excerpt}</p>
            <ArticleStats stats={stats} language={lang} compact />
            <span className="blog-card-read">{ui.read} <ArrowRight size={15} /></span>
          </a>;
        })}
      </section>
      <p className="blog-hub-disclaimer">{ui.disclaimer}</p>
    </main>
  );
}
