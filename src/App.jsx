import { useEffect, useState } from "react";
import Prayer from "./Component/Prayer";

function App() {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [dateTime, setDateTime] = useState("");
  const [city, setCity] = useState("Cairo");
  const [loading, setLoading] = useState(false);

  const cities = [
    { name: "القاهرة", value: "Cairo" },
    { name: "الإسكندرية", value: "Alexandria" },
    { name: "الجيزة", value: "Giza" },
    { name: "المنصورة", value: "Mansoura" },
    { name: "أسوان", value: "Aswan" },
    { name: "الأقصر", value: "Luxor" },
    { name: "شرم الشيخ", value: "Sharm El Sheikh" },
    { name: "بورسعيد", value: "Port Said" },
    { name: "طنطا", value: "Tanta" },
    { name: "الزقازيق", value: "Zagazig" },
    { name: "العريش", value: "AlArish" },
  ];

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true); // 👈 يبدأ التحميل

      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=EG&method=5&timezonestring=Africa/Cairo`,
        );

        if (!response.ok) {
          throw new Error("API response not ok");
        }

        const data = await response.json();

        setPrayerTimes(data.data.timings);
        setDateTime(data.data.date.gregorian.date);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchPrayerTimes();
  }, [city]);

  const formatTimes = (time) => {
    if (!time) {
      return "00:00";
    }
    let [hours, minutes] = time.split(":").map(Number);
    const perd = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${perd}`;
  };

  return (
    <section>
      <div className="container">
        <div className="top_sec">
          <div className="city">
            <h3>المدينه</h3>
            <select name="" id="" onChange={(e) => setCity(e.target.value)}>
              {cities.map((city_Obj) => (
                <option key={city_Obj.value} value={city_Obj.value}>
                  {city_Obj.name}
                </option>
              ))}
            </select>
          </div>
          <div className="date">
            <h3>التاريخ</h3>
            <h4>{dateTime} </h4>
          </div>
        </div>
        {loading ? (
         <h2> جاري تحميل مواقيت الصلاة...⏳</h2>
        ) : (
          <>
            <Prayer name="الفجر" time={formatTimes(prayerTimes.Fajr)} />
            <Prayer name="الظهر" time={formatTimes(prayerTimes.Dhuhr)} />
            <Prayer name="العصر" time={formatTimes(prayerTimes.Asr)} />
            <Prayer name="المغرب" time={formatTimes(prayerTimes.Maghrib)} />
            <Prayer name="العشاء" time={formatTimes(prayerTimes.Isha)} />
          </>
        )}
      </div>
    </section>
  );
}

export default App;
