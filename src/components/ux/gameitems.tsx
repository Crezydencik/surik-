"use client";

import Image from "next/image";
import { Users, Clock3, Trophy } from "lucide-react";
import styles from "./styles/game.module.scss";
import { GameItemProps } from "../../lib/interfase";

const GameItem = ({
  title,
  description,
  img,
  players,
  time,
  rating,
  difficulty = "Средний",
  category,
}: GameItemProps) => {
  return (
    <div className={styles["game-card"]}>
      {/* Картинка */}
      <div className={styles["image-wrapper"]}>
        <Image
          src={img}
          alt={title}
          width={400}
          height={250}
          className={styles["game-image"]}
        />
        <span className={styles["badge"]}>{difficulty}</span>
      </div>

      {/* Контент */}
      <div className={styles["content"]}>
        <div className="flex justify-between items-start mb-2">
          <h3 className={styles["title"]}>{title}</h3>

          {category && (
            <span className="bg-purple-700 text-white text-xs px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>
        {/* Иконки */}
        <div className={styles["meta"]}>
          <span>
            <Users size={15} className="bg :yellow" /> {players}
          </span>
          <span>
            <Clock3 size={14} /> {time}
          </span>
          <span>
            <Trophy size={14} /> {rating}
          </span>
        </div>

        <p className={styles["description"]}>{description}</p>

        {/* Низ */}
        {/* <div className={styles["footer"]}>
          <span
            className={`${styles["status"]} ${
              status === "available"
                ? styles["available"]
                : status === "busy"
                ? styles["busy"]
                : styles["queue"]
            }`}
          >
            {t[status][lang]}
          </span>
          {status === "available" && (
            <button className={styles["book-button"]}>{t.book[lang]}</button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default GameItem;
