import {useState, useEffect} from "react";

const any = (object) => {
	return Object.values(object).some((val) => !!val);
};

// const a = {
// 	plaintiff: {
// 		type: 0,
// 		name: "Андрей",
// 		phone: "+7 231 232 13 12",
// 		email: null,
// 		address: {
// 			type: null,
// 			value: "129515, г Москва, 5-й Останкинский пер",
// 			realestate: null,
// 			kladr: null,
// 			oktmo: null,
// 			inn: null,
// 		},
// 		representative: {
// 			name: null,
// 			surname: null,
// 			paternal: null,
// 			address: null,
// 			phone: null,
// 			POADate: null,
// 			POANumber: null,
// 		},
// 		defendant: {
// 			birthDate: null,
// 			birthPlace: null,
// 			workPlace: null,
// 			passport: {
// 				series: null,
// 				number: null,
// 				issuer: null,
// 				issueDate: null,
// 			},
// 			driverLicense: {
// 				series: null,
// 				number: null,
// 			},
// 			vehicleRegistration: {
// 				series: null,
// 				number: null,
// 				issuer: null,
// 				issueDate: null,
// 			},
// 			noData: false,
// 		},
// 		surname: "Андреев",
// 		paternal: "Иванович",
// 		changes: {
// 			name: null,
// 			surname: null,
// 			paternal: null,
// 			date: null,
// 			changeReason: null,
// 			reasonDate: null,
// 		},
// 	},
// 	defendant: {
// 		type: 2,
// 		name: 'ООО "ЯНДЕКС"',
// 		phone: null,
// 		email: null,
// 		address: {
// 			type: null,
// 			value: "г Москва, ул Льва Толстого, д 16",
// 			realestate: null,
// 			kladr: null,
// 			oktmo: null,
// 			inn: null,
// 		},
// 		representative: {
// 			name: null,
// 			surname: null,
// 			paternal: null,
// 			address: null,
// 			phone: null,
// 			POADate: null,
// 			POANumber: null,
// 		},
// 		defendant: {
// 			birthDate: null,
// 			birthPlace: null,
// 			workPlace: null,
// 			passport: {
// 				series: null,
// 				number: null,
// 				issuer: null,
// 				issueDate: null,
// 			},
// 			driverLicense: {
// 				series: null,
// 				number: null,
// 			},
// 			vehicleRegistration: {
// 				series: null,
// 				number: null,
// 				issuer: null,
// 				issueDate: null,
// 			},
// 			noData: false,
// 		},
// 		inn: "7736207543",
// 		kladr: "7700000000070950031",
// 		okato: "45286590000",
// 		oktmo: "45383000",
// 		autofillAddress: true,
// 		filial: {
// 			name: null,
// 		},
// 	},
// };

const Line = ({show = true, name = null, value}) => {
	if (!show || !value) {
		return null;
	}
	return (
		<span>
			{name !== null && <b>{name}: </b>}
			{value.replaceAll ? value.replaceAll("undefined", "") : value}
		</span>
	);
};

const App = () => {
	const [data, setData] = useState(null);
	if (typeof window !== "undefined") {
		window.setData = setData; // lol
	}
	useEffect(() => {
		console.log("data changed", data);
	}, [data]);

	if (!data) {
		return "";
	}

	let {plaintiff, defendant} = data;
	const representative = plaintiff.representative;
	defendant = {...defendant, ...defendant.defendant}; // bruh
	return (
		<aside>
			<p>
				{/* TODO: data.city is not implemented yet */}
				<Line value={`В ${data.city?.name} городской суд`} />
				<Line name="Адрес" value={data.city?.court} />
				<Line show={plaintiff.filial} name="Филиал" value={plaintiff.filial?.name} />
				<Line show={plaintiff.name} name="Истец" value={`${plaintiff.surname} ${plaintiff.name} ${plaintiff.paternal}`} />
				<Line name="Адрес" value={plaintiff.address.value} />
				<Line name="ИНН" value={plaintiff.address.inn} />
				<Line name="Тел" value={plaintiff.phone} />
				<Line show={representative.name} name="Представитель истца" value={`${representative.surname} ${representative.name} ${representative.paternal}`} />
				<Line name="Адрес" value={representative.address} />
				<Line name="Тел" value={representative.phone} />
			</p>
			<p>
				<Line show={defendant.filial} name="Филиал" value={defendant.filial?.name} />
				<Line show={defendant.name} name="Ответчик" value={`${defendant.surname} ${defendant.name} ${defendant.paternal}`} />
				<Line
					name={["Адрес", "Последний известный адрес", "Адрес места нахождения имущества", "Mесто жительства ответчика неизвестно", null][+defendant.address.type]}
					value={defendant.address.type <= 2 ? defendant.address.value : "приложено ходатайство об истребовании адресной информации в отношении ответчика"}
				/>
				<Line name="ИНН" value={defendant.inn} />
				<Line
					show={any(defendant.passport)}
					name="Паспорт гр. РФ"
					value={`серия ${defendant.passport.series} № ${defendant.passport.number} выдан ${defendant.passport.date} ${defendant.passport.issuer} ${defendant.passport.issuerCode}`}
				/>
				<Line show={any(defendant.driverLicense)} name="Водительское удостоверение" value={`${defendant.driverLicense.series} ${defendant.driverLicense.number}`} />
				<Line
					show={any(defendant.vehicleRegistration)}
					name="Свидетельство о регистрации ТС"
					value={`${defendant.vehicleRegistration.series} ${defendant.vehicleRegistration.number}`}
				/>
				<Line name="Дата рождения" value={defendant.birthDate} />
				<Line name="Место рождения" value={defendant.birthPlace} />
				<Line name="Тел" value={defendant.phone} />
				<Line name="ОГРНИП" value={defendant.ogrnip} />
				<Line name="Цена иска" value={"999’999"} />
			</p>
		</aside>
	);
};

export default App;
