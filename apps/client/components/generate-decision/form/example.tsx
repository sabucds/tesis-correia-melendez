// {
//     "totalBudget": 5000,
//     "factories": [
//         {
//             "name": "Guarenas",
//             "id": "f1"
//         },
//         {
//             "name": "El Junquito",
//             "id": "f2"
//         }
//     ],
//     "products": [
//         {
//             "name": "Papel",
//             "id": "p1"
//         },
//         {
//             "name": "Plastico",
//             "id": "p2"
//         }
//     ],
//     "clients": [
//         {
//             "name": "Altamira",
//             "id": "c1"
//         },
//         {
//             "name": "La Castellana",
//             "id": "c2"
//         },
//         {
//             "name": "Las Mercedes",
//             "id": "c3"
//         },
//         {
//             "name": "San Martin",
//             "id": "c4"
//         },
//         {
//             "name": "La Yaguara",
//             "id": "c5"
//         }
//     ],
//     "locations": [
//         {
//             "name": "Sebucan",
//             "id": "d1"
//         },
//         {
//             "name": "Macaracuay",
//             "id": "d2"
//         },
//         {
//             "name": "Sabana Grande",
//             "id": "d3"
//         }
//     ],
//     "assignationClientLocationCost": [
//         {
//             "client": "c1",
//             "location": "d1",
//             "cost": [
//                 8,
//                 15
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c2",
//             "location": "d1",
//             "cost": [
//                 5,
//                 0
//             ],
//             "uncertainty": false
//         },
//         {
//             "client": "c3",
//             "location": "d1",
//             "cost": [
//                 9,
//                 25
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c4",
//             "location": "d1",
//             "cost": [
//                 4,
//                 8
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c5",
//             "location": "d1",
//             "cost": [
//                 8,
//                 0
//             ],
//             "uncertainty": false
//         },
//         {
//             "client": "c1",
//             "location": "d2",
//             "cost": [
//                 7,
//                 20
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c2",
//             "location": "d2",
//             "cost": [
//                 3,
//                 0
//             ],
//             "uncertainty": false
//         },
//         {
//             "client": "c3",
//             "location": "d2",
//             "cost": [
//                 3,
//                 8
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c4",
//             "location": "d2",
//             "cost": [
//                 7,
//                 13
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c5",
//             "location": "d2",
//             "cost": [
//                 2,
//                 15
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c1",
//             "location": "d3",
//             "cost": [
//                 6,
//                 0
//             ],
//             "uncertainty": false
//         },
//         {
//             "client": "c2",
//             "location": "d3",
//             "cost": [
//                 8,
//                 0
//             ],
//             "uncertainty": false
//         },
//         {
//             "client": "c3",
//             "location": "d3",
//             "cost": [
//                 7,
//                 14
//             ],
//             "uncertainty": true
//         },
//         {
//             "client": "c4",
//             "location": "d3",
//             "cost": [
//                 5,
//                 0
//             ],
//             "uncertainty": false
//         },
//         {
//             "client": "c5",
//             "location": "d3",
//             "cost": [
//                 3,
//                 9
//             ],
//             "uncertainty": true
//         }
//     ],
//     "selectionLocationCost": [
//         {
//             "location": "d1",
//             "cost": 1500
//         },
//         {
//             "location": "d2",
//             "cost": 1800
//         },
//         {
//             "location": "d3",
//             "cost": 1700
//         }
//     ],
//     "shippingFactoryLocationProductCost": [
//         {
//             "factory": "f1",
//             "location": "d1",
//             "product": "p1",
//             "cost": 2
//         },
//         {
//             "factory": "f2",
//             "location": "d1",
//             "product": "p1",
//             "cost": 4
//         },
//         {
//             "factory": "f1",
//             "location": "d1",
//             "product": "p2",
//             "cost": 4
//         },
//         {
//             "factory": "f2",
//             "location": "d1",
//             "product": "p2",
//             "cost": 7
//         },
//         {
//             "factory": "f1",
//             "location": "d2",
//             "product": "p1",
//             "cost": 3
//         },
//         {
//             "factory": "f2",
//             "location": "d2",
//             "product": "p1",
//             "cost": 4
//         },
//         {
//             "factory": "f1",
//             "location": "d2",
//             "product": "p2",
//             "cost": 3
//         },
//         {
//             "factory": "f2",
//             "location": "d2",
//             "product": "p2",
//             "cost": 3
//         },
//         {
//             "factory": "f1",
//             "location": "d3",
//             "product": "p1",
//             "cost": 7
//         },
//         {
//             "factory": "f2",
//             "location": "d3",
//             "product": "p1",
//             "cost": 4
//         },
//         {
//             "factory": "f1",
//             "location": "d3",
//             "product": "p2",
//             "cost": 8
//         },
//         {
//             "factory": "f2",
//             "location": "d3",
//             "product": "p2",
//             "cost": 4
//         }
//     ],
//     "totalClientDemand": [
//         {
//             "client": "c1",
//             "totalDemand": 100
//         },
//         {
//             "client": "c2",
//             "totalDemand": 300
//         },
//         {
//             "client": "c3",
//             "totalDemand": 200
//         },
//         {
//             "client": "c4",
//             "totalDemand": 500
//         },
//         {
//             "client": "c5",
//             "totalDemand": 500
//         }
//     ],
//     "productClientDemand": [
//         {
//             "product": "p1",
//             "client": "c1",
//             "demand": 100
//         },
//         {
//             "product": "p1",
//             "client": "c2",
//             "demand": 300
//         },
//         {
//             "product": "p1",
//             "client": "c3",
//             "demand": 200
//         },
//         {
//             "product": "p2",
//             "client": "c4",
//             "demand": 500
//         },
//         {
//             "product": "p2",
//             "client": "c5",
//             "demand": 500
//         }
//     ],
//     "locationCapacity": [
//         {
//             "location": "d1",
//             "capacity": 1000
//         },
//         {
//             "location": "d2",
//             "capacity": 800
//         },
//         {
//             "location": "d3",
//             "capacity": 700
//         }
//     ],
//     "factoryProductCapacity": [
//         {
//             "factory": "f1",
//             "product": "p1",
//             "capacity": 500
//         },
//         {
//             "factory": "f2",
//             "product": "p2",
//             "capacity": 700
//         },
//         {
//             "factory": "f2",
//             "product": "p1",
//             "capacity": 400
//         },
//         {
//             "factory": "f1",
//             "product": "p2",
//             "capacity": 400
//         }
//     ]
// }
