// src/components/home/FacebookSection.tsx
import FbPostList from "./FbPostList";

export default async function FacebookSection() {
  // 🔹 Статичный контент для теста
  const initial = {
    data: [
      {
        id: "1",
        permalink_url: "https://facebook.com/examplepost1",
        created_time: "2025-10-25T18:00:00+0000",
        message:
          "🎲 Мы провели великолепный вечер настольных игр! Спасибо всем, кто пришёл 💙 #boardgames #liepaja",
        full_picture:
          "https://scontent.frix4-1.fna.fbcdn.net/v/t39.30808-6/552724735_122144300816843485_1778717522351932337_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=75d36f&_nc_ohc=352ip2oUFWQQ7kNvwEGU6lJ&_nc_oc=Adlr8i9X39lKmSUdmup1Wfx6RIw3gIGwLC_nbUEAaX6rmIxu3gbjrVHBmRtc2Z5i0L0&_nc_zt=23&_nc_ht=scontent.frix4-1.fna&_nc_gid=OuIBGZ_1zqXzQj4J-3eK6w&oh=00_AfhpVXelpD4lAgS-DvCcQoRChhVKrhtvFe6WpI0xplt70w&oe=690EAFA1",
      },
      {
        id: "2",
        permalink_url: "https://facebook.com/examplepost2",
        created_time: "2025-10-20T15:00:00+0000",
        message:
          "🧩 Новое поступление в нашем клубе! Попробуйте 'Catan' и 'Azul' уже в эти выходные!",
        full_picture:
          "https://scontent.frix4-1.fna.fbcdn.net/v/t39.30808-6/552724735_122144300816843485_1778717522351932337_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=75d36f&_nc_ohc=352ip2oUFWQQ7kNvwEGU6lJ&_nc_oc=Adlr8i9X39lKmSUdmup1Wfx6RIw3gIGwLC_nbUEAaX6rmIxu3gbjrVHBmRtc2Z5i0L0&_nc_zt=23&_nc_ht=scontent.frix4-1.fna&_nc_gid=OuIBGZ_1zqXzQj4J-3eK6w&oh=00_AfhpVXelpD4lAgS-DvCcQoRChhVKrhtvFe6WpI0xplt70w&oe=690EAFA1",
      },
      {
        id: "3",
        permalink_url: "https://facebook.com/examplepost3",
        created_time: "2025-10-10T10:00:00+0000",
        message:
          "💬 Делитесь своими любимыми настолками в комментариях! Что вы играете чаще всего?",
        full_picture:
          "https://scontent.frix4-1.fna.fbcdn.net/v/t39.30808-6/552724735_122144300816843485_1778717522351932337_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=75d36f&_nc_ohc=352ip2oUFWQQ7kNvwEGU6lJ&_nc_oc=Adlr8i9X39lKmSUdmup1Wfx6RIw3gIGwLC_nbUEAaX6rmIxu3gbjrVHBmRtc2Z5i0L0&_nc_zt=23&_nc_ht=scontent.frix4-1.fna&_nc_gid=OuIBGZ_1zqXzQj4J-3eK6w&oh=00_AfhpVXelpD4lAgS-DvCcQoRChhVKrhtvFe6WpI0xplt70w&oe=690EAFA1",
      },
    ],
  };

  return (
    <section className="mx-auto max-w-6xl p-6 space-y-6">
      <h2 className="text-2xl text-center font-semibold">Наши новости</h2>
      <FbPostList initial={initial} />
    </section>
  );
}
