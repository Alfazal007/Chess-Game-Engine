import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img className="max-w-96" src={"assets/landingboard.jpeg"} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white">
              Play chess online on the #1 site
            </h1>
            <div className="mt-4">
              <Button
                onClick={() => {
                  navigate("/game");
                }}
              >
                Play Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
