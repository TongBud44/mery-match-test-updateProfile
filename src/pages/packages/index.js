import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // สำหรับ Redirect
import { NavBar, Footer } from "@/components/NavBar";
import { CustomButton } from "@/components/CustomUi";
import { IoIosCheckmarkCircle } from "react-icons/io";

export default function MerryPackage() {
  const [packages, setPackages] = useState([]); // เก็บข้อมูลแพ็กเกจ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false); // เช็คสถานะการเป็นสมาชิก
  const router = useRouter(); // ใช้สำหรับ Redirect

  useEffect(() => {
    const token = localStorage.getItem("token"); // ตรวจสอบ Token ใน Local Storage
    if (token) {
      setIsMember(true); // หากมี Token ให้ถือว่าเป็นสมาชิก
    }

    // ดึงข้อมูลแพ็กเกจ
    const fetchPackages = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        const response = await axios.get(`${apiBaseUrl}/api/packages`);
        setPackages(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching packages");
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // ฟังก์ชันเมื่อคลิกปุ่ม Choose Package
  const handleChoosePackage = (id) => {
    if (isMember) {
      // หากเป็นสมาชิก Redirect ไปยังหน้า Package Details (ใส่ไว้รอหน้า paymentขึ้น หากเป็นสมาชิกจะเด้งไปที่หน้า Payment ของไอดีนั้นๆ)
      router.push(`/packages/${id}`);
    } else {
      // หากไม่ได้เป็นสมาชิก Redirect ไปยังหน้า Login
      alert("You must be logged in to choose a package!");
      router.push("/login");
    }
  };

  // ถ้ากำลังโหลด หรือเกิดข้อผิดพลาด ให้แสดงข้อความ
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavBar />
      <section className="bg-utility-primary p-5">
        <article className="flex  flex-col gap-2 bg-utility-primary p-4 pb-5 pt-5 lg:pb-14 lg:pl-52 lg:pt-10">
          <div>
            <h3 className="font-medium text-third-700">MERRY MEMBERSHIP</h3>
          </div>
          <div className="text-4xl font-bold text-second-500">
            <h1 className="lg:hidden">
              Join us and start <br /> matching
            </h1>
            <h1 className="hidden font-extrabold lg:block ">
              Be part of Merry Membership <br /> to make more Merry!
            </h1>
          </div>
        </article>

        <div className="items-center justify-center lg:flex lg:flex-row">
          <figure className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-3 lg:gap-x-5 lg:p-[15rem] lg:pb-24 lg:pt-7">
            {packages.map((pkg) => (
              <div
                className="lg:flex lg:flex-row lg:justify-around"
                key={pkg.id}
              >
                <article className="flex flex-col gap-3 rounded-box border-2 bg-utility-primary p-4 shadow-md lg:h-[26rem] lg:w-[100%] lg:p-6">
                  {/* icon package */}
                  <div className="border-1 flex h-16 w-16 flex-row items-center justify-center rounded-2xl bg-gray-100">
                    {/* แสดงรูปภาพ icon */}
                    <img
                      src={pkg.icon_url}
                      alt={pkg.title}
                      className="h-12 w-12 object-cover"
                    />
                  </div>
                  {/* Title package */}
                  <div>
                    <h1 className="text-3xl font-bold">{pkg.title}</h1>
                  </div>
                  <div className="flex gap-2">
                    {/* Currency data */}
                    <h2 className="text-2xl text-black">{pkg.currency_code}</h2>
                    <h2 className="text-2xl text-black">{pkg.price}</h2>
                    <h2 className="text-2xl text-gray-400">/month</h2>
                  </div>
                  {/* Cost package */}
                  <div>
                    <h1>
                      {pkg.cost} <span>{pkg.duration}</span>
                    </h1>
                  </div>
                  {/* Details */}
                  {pkg.details &&
                  Array.isArray(pkg.details) &&
                  pkg.details.length > 0 ? (
                    pkg.details.map((detail, index) => (
                      <div className="mt-1 flex flex-row gap-2" key={index}>
                        <IoIosCheckmarkCircle className="mt-1 text-second-400" />{" "}
                        <h1> {detail}</h1>
                      </div>
                    ))
                  ) : (
                    <div>No details available</div>
                  )}
                  <hr className="mb-3 mt-3" />

                  {/* Button */}
                  <CustomButton
                    className="flex flex-shrink-0 font-bold shadow-sm"
                    buttonType="secondary"
                    onClick={() => handleChoosePackage(pkg.id)}
                  >
                    Choose Package
                  </CustomButton>
                </article>
              </div>
            ))}
          </figure>
        </div>
      </section>

      <Footer />
    </>
  );
}
