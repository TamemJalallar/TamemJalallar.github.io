"use client";

import { useMemo, useState } from "react";

type Suit = "H" | "D" | "C" | "S";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
type StrategyMove = "Hit" | "Stand" | "Double Down";

type Card = {
  id: string;
  rank: Rank;
  suit: Suit;
};

type RoundOutcome = "win" | "loss" | "push";
type RoundPhase = "player-turn" | "round-over";

type GameState = {
  deck: Card[];
  player: Card[];
  dealer: Card[];
  phase: RoundPhase;
  outcome: RoundOutcome | null;
  wager: number;
  didDouble: boolean;
};

type Stats = {
  wins: number;
  losses: number;
  pushes: number;
};

const STARTING_BANKROLL = 1000;
const BASE_WAGER = 100;

const SUITS: Suit[] = ["H", "D", "C", "S"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_SYMBOLS: Record<Suit, string> = {
  H: "♥",
  D: "♦",
  C: "♣",
  S: "♠",
};

const BASE_STATS: Stats = {
  wins: 0,
  losses: 0,
  pushes: 0,
};

function cardValue(rank: Rank) {
  if (rank === "A") return 11;
  if (rank === "K" || rank === "Q" || rank === "J") return 10;
  return Number(rank);
}

function dealerUpValue(card: Card | undefined) {
  if (!card) return 0;
  return cardValue(card.rank);
}

function handTotal(hand: Card[]) {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    total += cardValue(card.rank);
    if (card.rank === "A") aces += 1;
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function isSoftHand(hand: Card[]) {
  let total = 0;
  let acesAsEleven = 0;

  for (const card of hand) {
    if (card.rank === "A") {
      total += 11;
      acesAsEleven += 1;
      continue;
    }
    total += cardValue(card.rank);
  }

  while (total > 21 && acesAsEleven > 0) {
    total -= 10;
    acesAsEleven -= 1;
  }

  return acesAsEleven > 0;
}

function bankrollDelta(outcome: RoundOutcome, wager: number) {
  if (outcome === "win") return wager;
  if (outcome === "push") return 0;
  return -wager;
}

function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

function createDeck() {
  const deck: Card[] = [];
  let counter = 0;

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      counter += 1;
      deck.push({
        id: `${rank}${suit}-${counter}`,
        rank,
        suit,
      });
    }
  }

  return deck;
}

function shuffleDeck(cards: Card[]) {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = deck[i];
    deck[i] = deck[j]!;
    deck[j] = current!;
  }
  return deck;
}

function drawCard(currentDeck: Card[]) {
  let deck = currentDeck;
  if (deck.length === 0) {
    deck = shuffleDeck(createDeck());
  }

  const [card, ...rest] = deck;
  if (!card) {
    throw new Error("Deck is empty and could not draw a card.");
  }

  return { card, deck: rest };
}

function resolveOutcome(player: Card[], dealer: Card[]): RoundOutcome {
  const playerScore = handTotal(player);
  const dealerScore = handTotal(dealer);

  if (dealerScore > 21) return "win";
  if (playerScore > dealerScore) return "win";
  if (playerScore < dealerScore) return "loss";
  return "push";
}

function createRound(wager: number): GameState {
  let deck = shuffleDeck(createDeck());
  const player: Card[] = [];
  const dealer: Card[] = [];

  for (let i = 0; i < 2; i += 1) {
    const playerDraw = drawCard(deck);
    player.push(playerDraw.card);
    deck = playerDraw.deck;

    const dealerDraw = drawCard(deck);
    dealer.push(dealerDraw.card);
    deck = dealerDraw.deck;
  }

  return {
    deck,
    player,
    dealer,
    phase: "player-turn",
    outcome: null,
    wager,
    didDouble: false,
  };
}

function suitColor(suit: Suit) {
  return suit === "H" || suit === "D" ? "text-rose-500" : "text-slate-900 dark:text-slate-100";
}

function recommendMove(player: Card[], dealerUpCard: Card | undefined, canDoubleDown: boolean): StrategyMove {
  const total = handTotal(player);
  const dealer = dealerUpValue(dealerUpCard);
  const soft = isSoftHand(player);

  let preferred: StrategyMove = "Hit";
  let fallback: Exclude<StrategyMove, "Double Down"> = "Hit";

  if (soft) {
    if (total <= 14) {
      if (dealer === 5 || dealer === 6) {
        preferred = "Double Down";
        fallback = "Hit";
      }
    } else if (total <= 16) {
      if (dealer >= 4 && dealer <= 6) {
        preferred = "Double Down";
        fallback = "Hit";
      }
    } else if (total === 17) {
      if (dealer >= 3 && dealer <= 6) {
        preferred = "Double Down";
        fallback = "Hit";
      }
    } else if (total === 18) {
      if (dealer >= 3 && dealer <= 6) {
        preferred = "Double Down";
        fallback = "Stand";
      } else if (dealer === 2 || dealer === 7 || dealer === 8) {
        preferred = "Stand";
      } else {
        preferred = "Hit";
      }
    } else {
      preferred = "Stand";
    }
  } else {
    if (total <= 8) {
      preferred = "Hit";
    } else if (total === 9) {
      if (dealer >= 3 && dealer <= 6) {
        preferred = "Double Down";
        fallback = "Hit";
      }
    } else if (total === 10) {
      if (dealer >= 2 && dealer <= 9) {
        preferred = "Double Down";
        fallback = "Hit";
      }
    } else if (total === 11) {
      if (dealer >= 2 && dealer <= 10) {
        preferred = "Double Down";
        fallback = "Hit";
      }
    } else if (total === 12) {
      preferred = dealer >= 4 && dealer <= 6 ? "Stand" : "Hit";
    } else if (total >= 13 && total <= 16) {
      preferred = dealer >= 2 && dealer <= 6 ? "Stand" : "Hit";
    } else {
      preferred = "Stand";
    }
  }

  if (preferred === "Double Down" && !canDoubleDown) {
    return fallback;
  }

  return preferred;
}

function statLabel(outcome: RoundOutcome) {
  if (outcome === "win") return "wins";
  if (outcome === "loss") return "losses";
  return "pushes";
}

function dealerVisibleScore(dealer: Card[], reveal: boolean) {
  if (reveal) return handTotal(dealer);
  if (dealer.length === 0) return 0;
  return cardValue(dealer[0]!.rank);
}

function cardLabel(card: Card | undefined) {
  if (!card) return "";
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

function HandCards({ cards, hideSecondCard }: { cards: Card[]; hideSecondCard?: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {cards.map((card, index) => {
        const hidden = hideSecondCard && index === 1;
        if (hidden) {
          return (
            <div
              key={`hidden-${card.id}`}
              className="flex h-24 w-16 items-center justify-center rounded-xl border border-gray-200/80 bg-slate-800 text-sm font-semibold text-white dark:border-white/15"
            >
              ♠
            </div>
          );
        }

        const symbol = SUIT_SYMBOLS[card.suit];

        return (
          <div
            key={card.id}
            className="relative flex h-24 w-16 items-center justify-center rounded-xl border border-gray-200/80 bg-white font-semibold shadow-sm dark:border-white/15 dark:bg-grey-900/70"
          >
            <div className={`absolute left-1 top-1 text-[10px] leading-none ${suitColor(card.suit)}`}>
              <div>{card.rank}</div>
              <div>{symbol}</div>
            </div>
            <span className={`text-2xl ${suitColor(card.suit)}`}>{symbol}</span>
            <div
              className={`absolute bottom-1 right-1 rotate-180 text-[10px] leading-none ${suitColor(card.suit)}`}
            >
              <div>{card.rank}</div>
              <div>{symbol}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BlackjackGame() {
  const [game, setGame] = useState<GameState>(() => createRound(BASE_WAGER));
  const [stats, setStats] = useState<Stats>(BASE_STATS);
  const [bankroll, setBankroll] = useState(STARTING_BANKROLL);

  const playerScore = useMemo(() => handTotal(game.player), [game.player]);
  const dealerScore = useMemo(
    () => dealerVisibleScore(game.dealer, game.phase === "round-over"),
    [game.dealer, game.phase],
  );
  const canDeal = game.phase === "round-over" && bankroll >= BASE_WAGER;
  const canDoubleDown =
    game.phase === "player-turn" &&
    game.player.length === 2 &&
    playerScore < 21 &&
    bankroll >= game.wager * 2;
  const recommendedAction = useMemo(
    () => recommendMove(game.player, game.dealer[0], canDoubleDown),
    [canDoubleDown, game.dealer, game.player],
  );

  const statusMessage = useMemo(() => {
    if (game.phase === "player-turn") {
      if (playerScore === 21) return "You have 21. Stand to settle the hand.";
      return "Hit to draw a card, stand to hold, or double down for one final card.";
    }
    if (game.outcome === "win") return "You win the hand.";
    if (game.outcome === "loss") return "Dealer wins the hand.";
    return "Push. Nobody wins this round.";
  }, [game.outcome, game.phase, playerScore]);

  const updateStats = (outcome: RoundOutcome) => {
    const key = statLabel(outcome);
    setStats((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  const finishRound = (
    next: Pick<GameState, "deck" | "player" | "dealer" | "wager" | "didDouble"> & {
      outcome: RoundOutcome;
    },
  ) => {
    setGame({
      deck: next.deck,
      player: next.player,
      dealer: next.dealer,
      phase: "round-over",
      outcome: next.outcome,
      wager: next.wager,
      didDouble: next.didDouble,
    });
    updateStats(next.outcome);
    setBankroll((prev) => prev + bankrollDelta(next.outcome, next.wager));
  };

  const handleNewRound = () => {
    if (!canDeal) return;
    setGame(createRound(BASE_WAGER));
  };

  const handleResetStats = () => {
    setStats({ ...BASE_STATS });
  };

  const handleResetBankroll = () => {
    setBankroll(STARTING_BANKROLL);
    setGame(createRound(BASE_WAGER));
  };

  const handleHit = () => {
    if (game.phase !== "player-turn" || playerScore >= 21) return;

    const draw = drawCard(game.deck);
    const nextPlayer = [...game.player, draw.card];
    const nextPlayerScore = handTotal(nextPlayer);

    if (nextPlayerScore > 21) {
      finishRound({
        deck: draw.deck,
        player: nextPlayer,
        dealer: game.dealer,
        outcome: "loss",
        wager: game.wager,
        didDouble: game.didDouble,
      });
      return;
    }

    setGame({
      ...game,
      deck: draw.deck,
      player: nextPlayer,
    });
  };

  const runDealerPlay = (startingDealer: Card[], startingDeck: Card[]) => {
    let dealer = [...startingDealer];
    let deck = startingDeck;

    while (handTotal(dealer) < 17) {
      const draw = drawCard(deck);
      dealer = [...dealer, draw.card];
      deck = draw.deck;
    }

    return { dealer, deck };
  };

  const handleStand = () => {
    if (game.phase !== "player-turn") return;

    const dealerResult = runDealerPlay(game.dealer, game.deck);
    const outcome = resolveOutcome(game.player, dealerResult.dealer);

    finishRound({
      deck: dealerResult.deck,
      player: game.player,
      dealer: dealerResult.dealer,
      outcome,
      wager: game.wager,
      didDouble: game.didDouble,
    });
  };

  const handleDoubleDown = () => {
    if (!canDoubleDown) return;

    const doubledWager = game.wager + BASE_WAGER;

    const draw = drawCard(game.deck);
    const nextPlayer = [...game.player, draw.card];

    if (handTotal(nextPlayer) > 21) {
      finishRound({
        deck: draw.deck,
        player: nextPlayer,
        dealer: game.dealer,
        outcome: "loss",
        wager: doubledWager,
        didDouble: true,
      });
      return;
    }

    const dealerResult = runDealerPlay(game.dealer, draw.deck);
    const outcome = resolveOutcome(nextPlayer, dealerResult.dealer);

    finishRound({
      deck: dealerResult.deck,
      player: nextPlayer,
      dealer: dealerResult.dealer,
      outcome,
      wager: doubledWager,
      didDouble: true,
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-500" />

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold">Blackjack</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Beat the dealer by getting closer to 21 without going over.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetBankroll}
            className="rounded-xl border border-gray-300/80 px-3 py-2 text-sm text-black transition-colors hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Reset bankroll
          </button>
          <button
            type="button"
            onClick={handleResetStats}
            className="rounded-xl border border-gray-300/80 px-3 py-2 text-sm text-black transition-colors hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Reset stats
          </button>
          <button
            type="button"
            onClick={handleNewRound}
            disabled={!canDeal}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Deal new hand
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-5">
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Wins: {stats.wins}
          </div>
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Losses: {stats.losses}
          </div>
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Pushes: {stats.pushes}
          </div>
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Bankroll: {formatMoney(bankroll)}
          </div>
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Hand wager: {formatMoney(game.wager)}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-grey-900/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Dealer</h3>
              <span className="text-xs text-black/60 dark:text-white/60">
                Score: {game.phase === "round-over" ? dealerScore : `${dealerScore}+?`}
              </span>
            </div>
            <p className="mt-2 text-xs text-black/60 dark:text-white/60">
              Up card: {cardLabel(game.dealer[0])}
            </p>
            <HandCards cards={game.dealer} hideSecondCard={game.phase === "player-turn"} />
          </div>

          <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-grey-900/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Player</h3>
              <span className="text-xs text-black/60 dark:text-white/60">Score: {playerScore}</span>
            </div>
            <p className="mt-2 text-xs text-black/60 dark:text-white/60">
              {game.didDouble ? "Double down active this hand." : "Base bet: $100"}
            </p>
            <HandCards cards={game.player} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleHit}
            disabled={game.phase !== "player-turn" || playerScore >= 21}
            className="rounded-xl border border-gray-300/80 px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Hit
          </button>
          <button
            type="button"
            onClick={handleStand}
            disabled={game.phase !== "player-turn"}
            className="rounded-xl bg-black px-4 py-2 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Stand
          </button>
          <button
            type="button"
            onClick={handleDoubleDown}
            disabled={!canDoubleDown}
            className="rounded-xl border border-gray-300/80 px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Double Down
          </button>
        </div>

        {game.phase === "player-turn" ? (
          <p className="mt-4 text-sm text-black/70 dark:text-white/70">
            Recommended (basic strategy): <span className="font-semibold">{recommendedAction}</span>
          </p>
        ) : null}

        <p className="mt-4 text-sm text-black/70 dark:text-white/70">{statusMessage}</p>
        {game.phase === "round-over" && bankroll < BASE_WAGER ? (
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
            Bankroll is below {formatMoney(BASE_WAGER)}. Reset bankroll to keep playing.
          </p>
        ) : null}
      </div>
    </div>
  );
}
