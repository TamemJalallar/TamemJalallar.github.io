"use client";

import { useMemo, useState } from "react";

type Suit = "H" | "D" | "C" | "S";
type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

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
};

type Stats = {
  wins: number;
  losses: number;
  pushes: number;
};

const SUITS: Suit[] = ["H", "D", "C", "S"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

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

function createRound(): GameState {
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
  };
}

function suitColor(suit: Suit) {
  return suit === "H" || suit === "D" ? "text-rose-500" : "text-slate-900 dark:text-slate-100";
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

function HandCards({ cards, hideSecondCard }: { cards: Card[]; hideSecondCard?: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {cards.map((card, index) => {
        const hidden = hideSecondCard && index === 1;
        if (hidden) {
          return (
            <div
              key={`hidden-${card.id}`}
              className="flex h-20 w-14 items-center justify-center rounded-xl border border-gray-200/80 bg-slate-800 text-xs font-semibold text-white dark:border-white/15"
            >
              HIDE
            </div>
          );
        }

        return (
          <div
            key={card.id}
            className="flex h-20 w-14 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-sm font-semibold dark:border-white/15 dark:bg-grey-900/70"
          >
            <span className={suitColor(card.suit)}>{`${card.rank}${card.suit}`}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function BlackjackGame() {
  const [game, setGame] = useState<GameState>(() => createRound());
  const [stats, setStats] = useState<Stats>(BASE_STATS);

  const playerScore = useMemo(() => handTotal(game.player), [game.player]);
  const dealerScore = useMemo(
    () => dealerVisibleScore(game.dealer, game.phase === "round-over"),
    [game.dealer, game.phase],
  );

  const statusMessage = useMemo(() => {
    if (game.phase === "player-turn") {
      if (playerScore === 21) return "You have 21. Stand to settle the hand.";
      return "Hit to draw another card, or stand to hold.";
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

  const handleNewRound = () => {
    setGame(createRound());
  };

  const handleResetStats = () => {
    setStats({ ...BASE_STATS });
  };

  const handleHit = () => {
    if (game.phase !== "player-turn" || playerScore >= 21) return;

    const draw = drawCard(game.deck);
    const nextPlayer = [...game.player, draw.card];
    const nextPlayerScore = handTotal(nextPlayer);

    if (nextPlayerScore > 21) {
      setGame({
        deck: draw.deck,
        player: nextPlayer,
        dealer: game.dealer,
        phase: "round-over",
        outcome: "loss",
      });
      updateStats("loss");
      return;
    }

    setGame({
      ...game,
      deck: draw.deck,
      player: nextPlayer,
    });
  };

  const handleStand = () => {
    if (game.phase !== "player-turn") return;

    let deck = game.deck;
    let dealer = [...game.dealer];

    while (handTotal(dealer) < 17) {
      const draw = drawCard(deck);
      dealer = [...dealer, draw.card];
      deck = draw.deck;
    }

    const outcome = resolveOutcome(game.player, dealer);

    setGame({
      deck,
      player: game.player,
      dealer,
      phase: "round-over",
      outcome,
    });
    updateStats(outcome);
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
            onClick={handleResetStats}
            className="rounded-xl border border-gray-300/80 px-3 py-2 text-sm text-black transition-colors hover:bg-gray-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Reset stats
          </button>
          <button
            type="button"
            onClick={handleNewRound}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Deal new hand
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Wins: {stats.wins}
          </div>
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Losses: {stats.losses}
          </div>
          <div className="rounded-xl border border-gray-200/70 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-grey-900/40">
            Pushes: {stats.pushes}
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
            <HandCards cards={game.dealer} hideSecondCard={game.phase === "player-turn"} />
          </div>

          <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-grey-900/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Player</h3>
              <span className="text-xs text-black/60 dark:text-white/60">Score: {playerScore}</span>
            </div>
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
        </div>

        <p className="mt-4 text-sm text-black/70 dark:text-white/70">{statusMessage}</p>
      </div>
    </div>
  );
}
