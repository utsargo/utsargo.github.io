---
title: "ক্লোজার্ড: Sierpinski triangle"
date: 2015-09-26 12:18:07 +0600
published: true
layout: post
mathify: true
tags:
- যন্ত্রচারী
- ক্লোজার
- ফাংশনাল প্রোগ্রামিং
comments: true
excerpt_separator: <!--more-->
---
Sierpinski triangle কী তা জানতে পারবেন [উইকিপিডিয়ায়](https://en.m.wikipedia.org/wiki/Sierpinski_triangle), আর এখানে যে প্রবলেমটি সলভ করছি এটি আছে [হ্যাকারর‍্যাঙ্কে](https://www.hackerrank.com/challenges/functions-and-fractals-sierpinski-triangles)। এই প্রবলেমটিতে আমাদের ইনপুট হিসেবে ১-৫ এর মধ্যে একটি সংখ্যা দেওয়া হবে, যেটি হবে ইটারেশন লেভেল। এবং সেই লেভেল পর্যন্ত ইটারেট করা ফলাফল আমাদের দিতে হবে এ্যাসকি আর্ট হিসেবে।

এবার প্ল্যানিঙে আসা যাক। মূল এ্যালগরিদমটা মোটামুটি এরকম: 

1. ইনপুট
2. রহস্যজনক কার্যক্রম
3. আউটপুট
<!--more-->
তবে এই এ্যালগরিদম দিয়ে বেশিদূর এগোনো যাবে না। আমাদের আরো ডিটেইলসে যেতে হবে।

একটা ফাংশনাল প্রোগ্রাম এক বা একাধিক ফাংশন দিয়ে তৈরী হয়। দুয়েকটা বাদে তার অধিকাংশই পিওর ফাংশন। অর্থাৎ তারা ডাটা নেয় এবং ডাটা রিটার্ন করে। কোনো সাইডএফেক্ট যেমন ইনপুট নেওয়া বা প্রিন্ট করা, এগুলো তারা করে না। আমাদের প্রোগ্রামে লাইন প্রিন্টিং ও মূল কন্ট্রোলার ফাংশনটি শুধু সাইডএফেক্ট দেখাবে। বাকিগুলো হবে পিওর ফাংশন। তো, এখন আমরা “রহস্যজনক কার্যক্রম”-এ মন দিই।

প্রথমেই আমাদের ভাবা উচিত ডাটা স্ট্রাকচার নিয়ে। একটা চমৎকার সাজানো-গোছানো ডাটা স্ট্রাকচার অনেক ঝামেলা থেকে বাঁচাবে। আমাদের আউটপুট দিতে হবে '1' ও '_' দিয়ে আঁকা দ্বিমাত্রিক এ্যাসকি আর্ট। তাই ছবিতে অবস্থানগুলো আমরা দুটি অক্ষের মান দ্বারা প্রকাশ করতে পারি। প্রথম লাইনের প্রথম অক্ষরের মান হবে `[1 1]` আবার ৫ম লাইনে ৬০তম বিন্দুটি `[60 5]`‌। আমাদের প্রত্যেক লাইনে ৬৩টি অক্ষর থাকবে এবং লাইন হবে ৩২টি। তাহলে আমরা:

* একটা বিন্দুকে প্রকাশ করতে পারি `[x y]` দিয়ে।
* একটা ত্রিভুজকে প্রকাশ করতে পারি তিনটি বিন্দু দিয়ে এভাবে: `[[x1 y1] [x2 y2] [x3 y3]]`
* আমরা শেষমেশ একটা ভেক্টর রিটার্ন করবো প্রিন্টার ফাংশনের কাছে যেটি সবগুলো "1" এর অবস্থান রেকর্ড করবে।
* আমরা শুরু করবো মূল ত্রিভুজ থেকে যার মান: `[[32 1] [1 32] [63 32]]`।

এবার আমরা মূল কাজে মন দিই। আমাদের প্রত্যেক ত্রিভুজকে তিনটি ত্রিভুজে ভাগ করতে হবে। অতএব ব্যাপারটা হবে এরকম:

1. কত লেভেল পর্যন্ত ইটারেশন হবে ইনপুট নাও।
2. যথেষ্ট ইটারেশন হয়েছে?
  * যদি হয় তবে ত্রিভুজগুলোর ভেক্টর রিটার্ন করো।
  * নাহলে ত্রিভুজগুলোকে ভাগ করো।
    1. ত্রিভুজের প্রত্যেক বাহুর মধ্যবিন্দু বের করো।
    2. তিনটি ত্রিভুজ বানাও।
3. ত্রিভুজের মান থেকে বের করো কোন বিন্দুগুলোতে “1” বসবে।
4. প্রিন্ট করো।

এখন প্রশ্ন হচ্ছে, ত্রিভুজে বাহুগুলোর মধ্যবিন্দু কীভাবে বের করবো? সিম্পল। এই সূত্র দিয়ে:
$$ (x, y) = \left({(x_1 + x_2) \over 2} , {(y_1 + y_2) \over 2} \right) $$
যেখানে $$ (x, y) $$ হচ্ছে $$ (x_1, y_1) $$ ও $$ (x_2, y_2) $$ এর মধ্যবিন্দু তাহলে আমরা লিখতে পারি:

{% highlight clojure %}
(defn halfer [pt1 pt2]
  (let [x1 (first pt1)
        y1 (last pt1)
        x2 (first pt2)
        y2 (last pt2)]
    [(/ (+ x1 x2) 2)
     (/ (+ y1 y2) 2)]))
{% endhighlight %}

কিন্তু এই ফাংশনটিতে আমাদের কাজ চলবে না। কারন, (/ 5 2) এর উত্তর আসবে 5/2 এবং (/ 5 2.0) হলেও 2.5 যার কোনোটাই আমরা মান হিসেবে ব্যবহার করতে পারবো না। আমাদের ক্ষেত্রে 5 এর মধ্যবিন্দু হতে হবে 3, এবং 4 এর 2। এজন্য আমরা _quot_ এবং _rem_ ব্যবহার করবো, পূর্ণসঙ্খ্যার ভাগফলের সাথে ভাগশেষ যোগ করে মধ্যবিন্দু নির্ণয় করবো এভাবে:

{% highlight clojure %}
(defn halfer [pt1 pt2]
  (let [x1 (first pt1)
        y1 (last pt1)
        x2 (first pt2)
        y2 (last pt2)]
    [(+ (quot (+ x1 x2) 2)
    	(rem (+ x1 x2) 2))	
     (+ (quot (+ y1 y2) 2)
     (rem (+ y1 y2) 2))]))
{% endhighlight %}

ফাংশনটি দুটি বিন্দুর মান নেবে আর্গুমেন্ট হিসেবে এবং আউটপুট দেবে মধ্যবিন্দু হিসেবে আরেকটি ভেক্টর। দেখা যাক কীভাবে কাজ করবে:

{% highlight clojure %}
user> (halfer [45 20] [30 25])
[38 23]
{% endhighlight %}

এবার আমরা _trisplitter_ নামে একটা ফাংশন লিখছি যেটি একটি ত্রিভুজের ভেক্টর নেবে, এবং _halfer_ এর সাহায্যে তিনটি ত্রিভুজের একটি ভেক্টর রিটার্ন করবে:

{% highlight clojure %}
(defn trisplitter [trivec]
  (let [a (first trivec)
        b (second trivec)
        c (last trivec)
        p (halfer a b)
        q (halfer b c)
        r (halfer a c)]
    [[a
      [(first p) (dec (last p))]
      [(dec (first r)) (dec (last r))]]
     [[(dec (first p)) (last p)] b
      [(dec (first q)) (last q)]]
     [r
      [(inc (first q)) (last q)] c]]))
{% endhighlight %}

এখানে আমরা _inc_ ও _dec_ ব্যবহার করে কিছু মান বাড়িয়ে বা কমিয়ে নিচ্ছি। কারন, এ্যাসকি আর্টে দুটো ত্রিভুজের কর্ণবিন্দু এক হতে পারে না। হ্যাকারর‍্যাঙ্কে [উদাহরণ](https://www.hackerrank.com/challenges/functions-and-fractals-sierpinski-triangles) দেখলেই বোঝা যাবে।

এবার আমরা _generator_ নামে একটা ফাংশন লিখছি যেটা দুটো আর্গুমেন্ট নেবে।  একটা ত্রিভুজের ভেক্টর নেবে আর্গুমেন্ট হিসেবে। অর্থাৎ এরকম: [[[32 1] [1 32] [63 32]]]। এবং অপরটি একটি নাম্বার যা ইটারেশন লেভেল হবে এবং _trisplitter_ এর সাহায্যে নতুন তৈরী ত্রিভুজগুলোর ভেক্টর তৈরী করে রিটার্ন করবে। জেনারেটর ফাংশন:

{% highlight clojure %}
(defn generator [dvec lvl]
  (loop [v dvec s 0]
    (if-not (< s lvl)
      v
      (recur (mapv identity
                   (apply concat
                         (map trisplitter v)))
             (inc s)))))
{% endhighlight %}

আমরা ত্রিভুজগুলো পেয়েছি। এখন আমরা ত্রিভুজের মধ্যবর্তী বিন্দুগুলো বের করবো। তারজন্যে আমাদের _elaborator_ ফাংশনটি লিখতে হবে। এই ফাংশনটি লেখার আগে আমরা _ranger_ নামে একটি সহায়ক ফাংশন লিখবো যেটি _elaborator_-কে একই লাইনের দুটো বিন্দুর মধ্যবর্তী বিন্দুগুলো বের করে দেবে:

{% highlight clojure %}
(defn ranger [i m end]
  (loop [upper i start m ar []]
    (if (not (<= start end))
      ar
      (recur upper
      	     (inc start)
	     (vec (concat ar
	     	  [[start upper]]))))))
{% endhighlight %}

এবার আমরা _elaborator_ ফাংশনটি লিখছি:

{% highlight clojure %}
(defn elaborator [dvec]
  (loop [start (second (first dvec))
  	 end (second (second dvec))
	 counter 0
	 li []]
    (if-not (<= start end)
      li
      (recur (inc start)
      	     end
	     (inc counter)
	     (concat li
	     	     (ranger start
		     	     (- (first (first dvec))
			     	counter)
			     (+ counter
			     	(first (first dvec)))))))))
{% endhighlight %}

_elaborator_ ফাংশনটি একটি ত্রিভুজের ওপর কাজ করে। তাই ত্রিভুজগুলোর ভেক্টরের প্রত্যেকটি ত্রিভুজের ওপর কাজ করাতে আমরা _combinator_ ফাংশনটি লিখছি:

{% highlight clojure %}
(defn combinator [dvec]
  (mapv identity
        (apply concat
               (map elaborator
               dvec))))
{% endhighlight %}

এবার আমরা প্রিন্টের জন্য ফাংশনগুলো লিখবো। প্রথমেই লিখবো _print-line_ ফাংশনটি। এটি দুটি আর্গুমেন্ট নেবে। লাইনের নম্বর এবং _combinator_ থেকে পাওয়া ভেক্টর। এবং সে ওই লাইনটি প্রিন্ট করবে: 

{% highlight clojure %}
(defn print-line [linum dvec]
  (loop [num linum start 1 vect dvec]
    (when (<= start 63)
      (if (some #{[start num]} vect)
        (print 1)
        (print "_"))
      (recur num (inc start) end vect))))
{% endhighlight %}

এবার আমরা _printer_ ফাংশনটি লিখছি যা প্রত্যেকটি লাইন প্রিন্ট করবে:

{% highlight clojure %}
(defn printer [dvec st end]
  (loop [start 1 vect dvec]
    (when (<= start 32)
      (do (print-line start vect)
          (println))
      (recur (inc start) vect))))
{% endhighlight %}

এবার আমরা _main_ ফাংশন লিখবো যেটি সবকিছু শুরু করবে:

{% highlight clojure %}
(defn main []
  (printer
    (combinator
      (generator [[[32 1] [1 32] [63 32]]]
                 (read)))))
{% endhighlight %}

আমাদের প্রোগ্রাম তৈরী! পুরো কোড:

{% highlight clojure %}
(defn halfer [pt1 pt2]
  (let [x1 (first pt1)
        y1 (last pt1)
        x2 (first pt2)
        y2 (last pt2)]
    [(+ (quot (+ x1 x2) 2)
    	(rem (+ x1 x2) 2))	
     (+ (quot (+ y1 y2) 2)
     (rem (+ y1 y2) 2))]))

(defn trisplitter [trivec]
  (let [a (first trivec)
        b (second trivec)
        c (last trivec)
        p (halfer a b)
        q (halfer b c)
        r (halfer a c)]
    [[a
      [(first p) (dec (last p))]
      [(dec (first r)) (dec (last r))]]
     [[(dec (first p)) (last p)] b
      [(dec (first q)) (last q)]]
     [r
      [(inc (first q)) (last q)] c]]))

(defn generator [dvec lvl]
  (loop [v dvec s 0]
    (if-not (< s lvl)
      v
      (recur (mapv identity
                   (apply concat
                         (map trisplitter v)))
             (inc s)))))

(defn ranger [i m end]
  (loop [upper i start m ar []]
    (if (not (<= start end))
      ar
      (recur upper
      	     (inc start)
	     (vec (concat ar
	     	  [[start upper]]))))))

(defn elaborator [dvec]
  (loop [start (second (first dvec))
  	 end (second (second dvec))
	 counter 0
	 li []]
    (if-not (<= start end)
      li
      (recur (inc start)
      	     end
	     (inc counter)
	     (concat li
	     	     (ranger start
		     	     (- (first (first dvec))
			     	counter)
			     (+ counter
			     	(first (first dvec)))))))))

(defn combinator [dvec]
  (mapv identity
        (apply concat
               (map elaborator
               dvec))))

(defn print-line [linum dvec]
  (loop [num linum start 1 vect dvec]
    (when (<= start 63)
      (if (some #{[start num]} vect)
        (print 1)
        (print "_"))
      (recur num (inc start) vect))))

(defn printer [dvec]
  (loop [start 1 vect dvec]
    (when (<= start 32)
      (do (print-line start vect)
          (println))
      (recur (inc start) vect))))

(defn main []
  (printer
    (combinator
      (generator [[[32 1] [1 32] [63 32]]]
                 (read)))))
{% endhighlight %}
