/* Randomized practice questions based on Learnee's current materials. */
(() => {
  const rand = n => Math.floor(Math.random() * n);
  const shuffle = list => { const a=[...list]; for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];} return a; };
  const unique = values => [...new Set(values)];
  const format = n => new Intl.NumberFormat('id-ID').format(n);
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  const fraction = (n,d) => {const g=gcd(n,d);return `${n/g}/${d/g}`;};
  function question(text,answer,distractors,explanation){const options=unique([answer,...distractors]).slice(0,4);while(options.length<4){const candidate=String(answer.includes('/')?fraction(1+rand(4),5+rand(5)):Number(answer)+1+rand(8));if(!options.includes(candidate))options.push(candidate)}const shuffled=shuffle(options);return [text,shuffled,shuffled.indexOf(answer),explanation];}
  function mathQuestions(){
    const out=[];
    for(let k=0;k<2;k++){
      const a=3+rand(13),d=2+rand(8),n=6+rand(9),term=a+(n-1)*d;
      out.push(question(`Barisan aritmetika memiliki suku pertama ${a} dan beda ${d}. Nilai suku ke-${n} adalah ...`,String(term),[String(term-d),String(term+d),String(a+n*d)],`Uₙ=a+(n−1)d=${a}+(${n}−1)×${d}=${term}.`));
      const count=8+rand(8),first=2+rand(10),diff=2+rand(6),sum=count*(2*first+(count-1)*diff)/2;
      out.push(question(`Jumlah ${count} suku pertama deret ${first}+${first+diff}+${first+2*diff}+... adalah ...`,String(sum),[String(sum-count),String(sum+count),String(first+count*diff)],`Sₙ=n/2(2a+(n−1)d)=${count}/2×(${2*first}+(${count}−1)×${diff})=${sum}.`));
      const capital=(2+rand(9))*1000000,rate=[4,5,6,8,10,12][rand(6)],years=1+rand(4),interest=capital*rate*years/100;
      out.push(question(`Modal Rp${format(capital)} mendapat bunga tunggal ${rate}% per tahun selama ${years} tahun. Besar bunganya adalah ...`,`Rp${format(interest)}`,[`Rp${format(interest/2)}`,`Rp${format(interest+capital*rate/100)}`,`Rp${format(capital*rate/100)}`],`Bunga=modal×suku bunga×waktu=${format(capital)}×${rate}%×${years}=Rp${format(interest)}.`));
      const principal=(2+rand(8))*1000000,compoundRate=[5,10,20,25][rand(4)],periods=2+rand(3),amount=Math.round(principal*Math.pow(1+compoundRate/100,periods));
      out.push(question(`Investasi Rp${format(principal)} tumbuh ${compoundRate}% per tahun dengan bunga majemuk selama ${periods} tahun. Nilai akhirnya kira-kira ...`,`Rp${format(amount)}`,[`Rp${format(Math.round(principal*(1+compoundRate/100*periods)))}`,`Rp${format(amount+principal*compoundRate/100)}`,`Rp${format(principal)}`],`Mₙ=M₀(1+i)ⁿ. Nilainya sekitar Rp${format(amount)}.`));
      const objects=4+rand(4),arrange=2+rand(Math.min(3,objects-1)),perm=Array.from({length:arrange},(_,i)=>objects-i).reduce((x,v)=>x*v,1);
      out.push(question(`Dari ${objects} finalis dipilih juara I hingga juara ${arrange}. Banyak susunan pemenang adalah ...`,String(perm),[String(perm/arrange),String(objects**arrange),String(perm+objects)],`Urutan juara berbeda, jadi gunakan permutasi ${objects}P${arrange}=${perm}.`));
      const total=7+rand(5),picked=2+rand(3),combination=Array.from({length:picked},(_,i)=>(total-i)/(picked-i)).reduce((x,v)=>x*v,1);
      out.push(question(`Dari ${total} siswa dipilih ${picked} orang untuk tim tanpa jabatan khusus. Banyak pilihan tim adalah ...`,String(combination),[String(combination*picked),String(total**picked),String(combination+total)],`Urutan tidak diperhatikan, jadi gunakan kombinasi C(${total},${picked})=${combination}.`));
      const red=2+rand(5),blue=2+rand(5),totalBalls=red+blue,redChance=fraction(red,totalBalls);
      out.push(question(`Sebuah kotak berisi ${red} bola merah dan ${blue} bola biru. Peluang mengambil bola merah adalah ...`,redChance,[fraction(blue,totalBalls),fraction(1,totalBalls),fraction(red+1,totalBalls+1)],`P(merah)=${red}/${totalBalls}=${redChance}.`));
      const dieMin=1+rand(3),favorable=6-dieMin,dieChance=fraction(favorable,6);
      out.push(question(`Sebuah dadu seimbang dilempar sekali. Peluang muncul angka lebih besar dari ${dieMin} adalah ...`,dieChance,[fraction(dieMin,6),fraction(1,6),fraction(5,6)],`Ada ${favorable} hasil yang lebih besar dari ${dieMin} dari total 6, jadi peluangnya ${dieChance}.`));
    }
    return out;
  }
  window.LearneeQuestionFactory=(subject,bank)=>{
    let pool=bank.qPool?.length?bank.qPool:(bank.q||[]);
    if(subject==='Matematika Lanjut')pool=[...pool,...mathQuestions()];
    const selected=shuffle(pool).slice(0,Math.min(5,pool.length));
    return selected.map(([prompt,choices,answer,explanation])=>{const pairs=shuffle(choices.map((choice,index)=>({choice,correct:index===answer})));return [prompt,pairs.map(x=>x.choice),pairs.findIndex(x=>x.correct),explanation]});
  };
})();
