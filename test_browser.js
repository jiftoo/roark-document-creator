fetches = Array(100).fill(1).map(() => fetch("http://217.15.202.178:3000/pdf/example.com?rnd="+Math.random().toString().split(".")[1], {
	mode: "cors"
}).then(v => v.blob()));
console.time("fetch");
Promise.all(fetches).then(res => console.timeEnd("fetch"));
fetches = [];
