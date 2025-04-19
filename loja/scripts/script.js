        // Captura o parâmetro da URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Exemplo de como usar o ID para buscar os detalhes do produto
        const products = {
            1: { name: "Produto 1", description: "Descrição do Produto 1", price: "R$ 100,00", image: "imagens/card1.jpg" },
            2: { name: "Produto 2", description: "Descrição do Produto 2", price: "R$ 150,00", image: "imagens/card2.jpg" },
            3: { name: "Produto 3", description: "Descrição do Produto 3", price: "R$ 200,00", image: "imagens/card3.jpg" }
        };

        const product = products[productId];

        if (product) {
            document.querySelector('.product-title').textContent = product.name;
            document.querySelector('.product-description').textContent = product.description;
            document.querySelector('.product-price').textContent = product.price;
            document.querySelector('.product-image').src = product.image;
        } else {
            document.querySelector('.container').innerHTML = '<p>Produto não encontrado.</p>';
        }


        function carregarCarrinho() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItemsContainer = document.getElementById('cart-items');
            let total = 0;

            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>${item.price}</p>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
                total += parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
            });

            document.getElementById('total-price').textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
        }

        function finalizarCompra() {
            alert('Compra finalizada! Obrigado pela sua compra.');
            localStorage.removeItem('cart'); // Limpa o carrinho após a compra
            window.location.href = 'index.html'; // Redireciona para a página inicial
        }

        // Carrega os itens do carrinho ao abrir a página
        window.onload = carregarCarrinho;