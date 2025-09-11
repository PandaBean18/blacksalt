import Image from "next/image";
import Button from "./components/button";

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="w-full md:w-min h-full md:h-min m-auto flex flex-col justify-between">
        <div className="flex flex-col md:flex-row justify-start md:justify-center items-center p-[50px] h-full md:h-min">
          <Button url="/store" text="Store Data" dark={false}></Button>
          <div className="h-[20px] w-[50px]"></div>
          <Button url="/receive" text="View Data" dark={true} ></Button>
        </div>
      </div>
    </div>
  );
}
