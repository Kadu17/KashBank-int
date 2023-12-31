import { SyntheticEvent, useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import { useRouter } from "next/router";
import { setTimeout } from "timers";
import axios from "axios";

export default function Client() {
  const router = useRouter();

  const [data, setData] = useState(Object);
  const [card, setCard] = useState(Object);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState("");

  const handleData =async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/user/", {
        credentials: "include",
        method: "GET",
      });
      const user = await response.json();
      setUser(user.name);
      setAuth(true);
      setTimeout(() => {
        acc(user.id);
      }, 250);
      setTimeout(() => {
        cc(user.id);
      }, 250);

      if (user.detail == "Unauthenticated!") {
        setAuth(false);
        setTimeout(async () => {
          await router.push("/login");
        }, 1000);
      }
    } catch (e) {
      setAuth(false);
      await router.push("/login");
      console.log(e);
    }
  }

  useEffect(() => {
    handleData()
  }, []);

  function acc(idParam: number) {
    console.log(idParam)
    try {
      fetch(`http://localhost:8000/bank/accounts/${idParam}`, {
        credentials: "include",
        method: "GET",
      })
        .then((e) => e.json())
        .then((e) => setData(e));
    } catch (e) {
      console.log(e);
    }
  }

  function cc(idParam: number) {
    console.log(idParam)

    try {
      fetch(`http://localhost:8000/bank/card/${idParam}`, {
        credentials: "include",
        method: "GET",
      })
        .then((e) => e.json())
        .then((e) => setCard(e));
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Layout auth={auth}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen">
          <h3 className="text-xl font-bold p-3 text-black">Welcome {user}!</h3>
          <div className="flex flex-col w-full lg:flex-row">
            <div className="grid flex-grow h-32 card bg-stone-100 rounded-box place-items-center text-black">
              <p className="font-medium group text-xl">Account Data:</p>
              <p>Number: {data.number}</p>
              <p>Agency: {data.agency}</p>
            </div>
            <div className="divider lg:divider-horizontal"></div>

            <div className="flex-grow h-32 w-32 bg-gray-800 rounded-box items-center shadow-lg flex justify-between p-3 border-b-4 border-gray-600 text-white font-medium group ">
              <div className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12">
                <svg
                  width="30"
                  height="30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="stroke-current text-blue-800 dark:text-gray-800 transform transition-transform duration-500 ease-in-out"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl">R$ {data.balance}</p>
                <p>Balance</p>
              </div>
            </div>
          </div>

          <div className="pt-10">
            <div className="w-96 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
              <img
                className="relative object-cover w-full0 h-full rounded-xl"
                src="https://i.imgur.com/kGkSg1v.png"
              />

              <div className="w-full px-8 absolute top-8">
                <div className="flex justify-between">
                  <div className="">
                    <p className="font-light">Name</p>
                    <p className="font-medium tracking-widest">{user}</p>
                  </div>
                  <img
                    className="w-14 h-14"
                    src="https://i.imgur.com/bbPHJVe.png"
                  />
                </div>
                <div className="pt-1">
                  <p className="font-light">Card Number</p>
                  <p className="font-medium tracking-more-wider">
                    {card.number}
                  </p>
                </div>
                <div className="pt-6 pr-6">
                  <div className="flex justify-between">
                    <div className="">
                      <p className="font-light text-xs">Expiry</p>
                      <p className="font-medium tracking-wider text-sm">
                        {card.expiration_date}
                      </p>
                    </div>

                    <div className="">
                      <p className="font-light text-xs">CVV</p>
                      <p className="font-bold tracking-more-wider text-sm">
                        {card.cvv}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
