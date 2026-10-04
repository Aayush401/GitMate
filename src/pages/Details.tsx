import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThreeCircles } from "react-loader-spinner";

export default function Details() {
    const navigate = useNavigate()
    const { refreshAuth } = useAuth();

  const [form, setForm] = useState({
    bio: "",
    experience: "BEGINNER",
    skills: "",
    goals: "",
    availability: "",
    timezone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading("Submitting your profile");

    try {
        console.log(form)
        try {
            const profile = await api.post("/profile", form);
            console.log(profile.data)
            
            // revalidate profile status
            const res = await api.get("/profile");

            if (res.data.success) {
                await refreshAuth();
                toast.success("Profile created successfuly!",{id: toastId})
                navigate("/dashboard");
            }
            
        } catch (error: any) {
            toast.error("An unexpected error ocurred!")
            console.error("Frontend fetch error: ", error.message)
        }
        finally{
            setLoading(false)
        }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4 py-10">
        <h2 className="text-3xl font-bold">
            Complete Your{" "}
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Profile
            </span>
        </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl border rounded-2xl p-8 space-y-6 shadow-2xl"
      >
        {/* Heading */}
        <div className="text-center space-y-2">
          <p className=" text-sm">
            Help us find your perfect coding match
          </p>
        </div>

        {/* Input wrapper style */}
        {[
          { label: "Bio", name: "bio", type: "textarea", placeholder: "Frontend developer..." },
          { label: "Skills", name: "skills", placeholder: "React, Node..." },
          { label: "Goals", name: "goals", placeholder: "Build cool stuff..." },
          { label: "Availability", name: "availability", placeholder: "Weekends..." },
          { label: "Timezone", name: "timezone", placeholder: "Asia/Kolkata" },
        ].map((field) => (
          <div key={field.name}>
            <label className="text-sm ">{field.label}</label>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="mt-2 w-full border border-gray-700 rounded-xl p-3 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
              />
            ) : (
              <input
                type="text"
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="mt-2 w-full border border-gray-700 rounded-xl p-2.5 sm:p-3 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
              />
            )}
          </div>
        ))}

        {/* Experience */}
        <div>
          <label className="text-sm">Experience</label>
          <select
            name="experience"
            value={form.experience}
            onChange={handleChange}
            required
            className="mt-2 w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
          >
            <option value="BEGINNER" className="rounded-md">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-black hover:opacity-90 transition shadow-lg shadow-green-500/20 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}