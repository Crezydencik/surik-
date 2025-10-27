'use client'; 
import { Users, Puzzle, Group, Wifi } from 'lucide-react'; // Импортируем иконки из Lucide


const missprimacy = [
  {
    icon: Users,
    title: "WITH FRIENDS",
    desc: "Don’t worry during the event, our coordinators will help explain the rules of any game that interests you.",
  },
  {
    icon: Puzzle,
    title: "RANDOM",
    desc: "We will help you find the best game depending on your interests and preferences during the event.",
  },
  {
    icon: Group,
    title: "TEAM BUILDING",
    desc: "Join in and enjoy the experience with your team. Our coordinators will help you engage with your team through fun games.",
  },
  {
    icon: Wifi,
    title: "ONLINE",
    desc: "We offer online sessions for board games. Stay connected and enjoy games with friends remotely.",
  },
];

const MissionSection = () => {
  return (
    <section className="mission-section bg-[#050119] text-white py-16 px-6">
      <div className="container mx-auto text-center space-y-12">
        {/* Заголовок */}
        <h2 className="text-3xl font-bold">GAME FOR ALL AGES!</h2>
        <h3 className="text-4xl font-semibold text-[#394DFF]">MISSION OF OUR CLUB</h3>

        {/* Иконки с подписями */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {missprimacy.map((item, index) => (
            <div key={index} className="mission-card text-center">
              <div className="mb-4">
                <item.icon className="w-16 h-16 mx-auto text-xl mb-6 text-blue-500" />
              </div>
              <h4 className="text-2xl font-semibold mb-4">{item.title}</h4>
              <p className="text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
