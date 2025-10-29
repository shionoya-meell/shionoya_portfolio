console.log("JavaScript が実行された！");



$(window).scroll(function (){
	$('.fadein').each(function(){
		var elemPos = $(this).offset().top,
		scroll = $(window).scrollTop(),
		windowHeight = $(window).height();

			if (scroll > elemPos - windowHeight + 150){
				$(this).addClass('scrollin');
			}
	});
});



document.addEventListener('DOMContentLoaded', function() {
    // カードの要素を取得
    const cards = document.querySelectorAll('.card');
    const resetButton = document.querySelector('.reset-button');
    const timerText = document.querySelector('.timer-text');
    const completionMessage = document.querySelector('.completion-message');
    
    let firstCard = null;
    let secondCard = null;
    let hasFlippedCard = false;
    let lockBoard = false;
    let timer = 0;
    let timerInterval = null;
    let matchedPairs = 0;
    
    // タイマーの開始
    function startTimer() {
      stopTimer(); // 既存のタイマーをクリア
      timer = 0;
      updateTimerDisplay();
      timerInterval = setInterval(function() {
        timer++;
        updateTimerDisplay();
      }, 1000);
    }
    
    // タイマーの停止
    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
    
    // タイマー表示の更新
    function updateTimerDisplay() {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // カードをめくる
    function flipCard() {
    console.log("こんにちは");
      if (lockBoard) return;
      if (this === firstCard) return;
      if (this.classList.contains('flipped')) return;
      
      this.classList.add('flipped');
      
      if (!hasFlippedCard) {
        // 1枚目のカード
        hasFlippedCard = true;
        firstCard = this;
        return;
      }
      
      // 2枚目のカード
      secondCard = this;
      checkForMatch();
    }
    
    // マッチしているか確認
    function checkForMatch() {
      // data-image属性を使ってマッチングを行う
      const isMatch = firstCard.dataset.image === secondCard.dataset.image;
      
      if (isMatch) {
        disableCards();
        matchedPairs++;
        
        // すべてのペアが見つかったかチェック
        if (matchedPairs === cards.length / 2) {
          gameComplete();
        }
      } else {
        unflipCards();
      }
    }
    
    // マッチしたカードを無効化
    function disableCards() {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      
      resetBoard();
    }
    
    // マッチしなかったカードを裏返す
    function unflipCards() {
      lockBoard = true;
      
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        resetBoard();
      }, 1000);
    }
    
    // ボードをリセット
    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }
    
    // ゲーム完了
    function gameComplete() {
      stopTimer();
      completionMessage.querySelector('.completion-time').textContent = `クリアタイム: ${timerText.textContent}`;
      completionMessage.classList.add('visible');
    }
    
    // カードをシャッフル
    function shuffle() {
      const cardGrid = document.querySelector('.card-grid');
      const cardWrappers = Array.from(document.querySelectorAll('.card-wrapper'));
      
      // カードの順番をランダムに並び替え
      cardWrappers.sort(() => Math.random() - 0.5);
      
      // DOMに反映
      cardWrappers.forEach(wrapper => {
        cardGrid.appendChild(wrapper);
      });
    }
    
    // ゲームのリセット
    function resetGame() {
      stopTimer();
      startTimer();
      
      // カードをすべて裏返し、マッチ状態をリセット
      cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.addEventListener('click', flipCard);
      });
      
      // カードをシャッフル
      shuffle();
      
      completionMessage.classList.remove('visible');
      matchedPairs = 0;
      resetBoard();
    }
    
    // イベントリスナーの設定
    cards.forEach(card => card.addEventListener('click', flipCard));
    resetButton.addEventListener('click', resetGame);
    
    // ゲーム初期化
    resetGame();
  });