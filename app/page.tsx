import Image from "next/image";
import Button from "./components/button";

export default function Home() {
  return (
    <div className="h-full w-full">
      <div className="w-full md:w-min h-min md:h-min m-auto flex flex-col justify-between">
        <div className="flex flex-col md:flex-row justify-center md:justify-center items-center p-[50px] h-full md:h-min">
          <Button url="/store" text="Store Data" dark={false}></Button>
          <div className="h-[20px] w-[50px]"></div>
          <Button url="/receive" text="View Data" dark={true} ></Button>
        </div>
        
      </div>
      <div className="w-full p-[50px] pt-[10px]">
          <p className="text-5xl font-semibold">BLCKSLT.</p>
          <div className="w-full h-[1px] bg-[#4f4f4f] mt-[10px] mb-[10px]"></div>
          <div className="h-[50px]"></div>
          <div className="flex flex-row justify-around items-center">
            <div className="hidden md:flex w-[30%]  flex-row items-center justify-center">
              <img src="/wooper.png" className="w-1/2" alt="wooper" />
            </div>
            <div className="h-full w-full md:w-[60%] flex flex-col justify-start">
              <div className="w-full min-h-[100px] md:min-h-0 md:h-min flex flex-row">
                <img src="/wooper.png" className="md:hidden h-[100px]" alt="" />
                <p className="text-5xl font-semibold w-[75%] md:w-full text-right md:text-left">What Is It?</p>
              </div>
              <p className="text-xl tracking-[0.00rem]">Blacksalt is an ephermeral storage service that allows users to upload small sized data such as texts and small files securly for a short amount of time. The main goal of the application is to provide a way other than having to upload to your drive or sending the item to yourself if you wanted to share data between devices.</p>

            </div>
          </div>
          <div className="h-[50px]"></div>
          <div className="flex flex-row justify-around items-center">
            
            <div className="h-full w-full md:w-[60%] flex flex-col justify-start">
              <div className="w-full min-h-[100px] md:min-h-0 md:h-min flex flex-row">
                <p className="text-5xl font-semibold w-[75%] md:w-full">How Does It Work?</p>
                <img src="/quagsire.png" className="md:hidden h-[100px]" alt="" />
              </div>
              
              <p className="text-xl tracking-[0.00rem]">Blacksalt prompts the user to make a pattern on a 4x4 grid by connecting a minimum of 6 dots. We then convert the pattern into a string that becomes the input for a key derivation function. The key derivation function then derives two things: A unique identifier for storing the data in our database, and a cryptographic key which is used to encrypt the data. This data is then stored in our database and can only be accessed within the next 5 minutes. To retrieve the data, the user must redraw their pattern within the next 5 minutes on the receive endpoint.</p>

            </div>
            <div className="hidden md:flex w-[30%] flex-row items-center justify-center">
              <img src="/quagsire.png" className="w-1/2" alt="quagsire" />
            </div>
          </div>
      </div>
    </div>
  );
}
