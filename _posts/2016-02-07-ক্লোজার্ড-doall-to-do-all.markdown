---
published: true
layout: post
title: "ক্লোজার্ড: doall to Do all"
date: 2016-02-07 11:31:00 +0600
comments: true
published: true
tags: ["ক্লোজার","লিস্প","ফাংশনাল প্রোগ্রামিং", "যন্ত্রচারী"]
excerpt_separator: <!--more-->
---
একটা সিম্পল ফাংশন লেখা যাক, যেটা কিনা (range 10) এর মধ্যে নাম্বারগুলো প্রিন্ট করবে:

{% highlight clojure %}
(defn print-num-seq []
  (map println (range 10)))
{% endhighlight %}

রান করলে ঠিকঠাকই কাজ করবে, অর্থাৎ 0 থেকে 9 পর্যন্ত সংখ্যাগুলো প্রিন্ট করবে। এবার, একই কাজ যদি আমরা পাঁচবার করতে চাই তাহলে তারজন্য এমন একটা ফাংশন লিখতে পারি:

{% highlight clojure %}
(defn print-recur []
  (loop [i 0]
    (when (< i 5)
      (print-num-seq)
      (recur (inc i)))))
{% endhighlight %}

মজার বিষয় হচ্ছে রান করলে শুধু `nil` রিটার্ন করবে। কিছুই প্রিন্ট করবে না।
<!--more-->
### কেন? ###
`println` `print-num-seq` এর সাইডএফেক্ট। আর `print-recur` কিছু প্রিন্ট করুক বা না করুক তার রিটার্ন ভ্যালু হবে nil। আসলে এটিই মূল ফলাফল। এখন লেজি সিকোয়েন্সের ক্ষেত্রে সেই সব সাইড এফেক্টগুলোই এক্সিকিউট করা হয় যেগুলোর ফলাফল মূল ফলাফলে প্রভাব রাখবে। এজন্যই কিচ্ছু প্রিন্ট হয়নি।

### doall saves the day! ###

`doall` এর কাজ হলো, লেজি সিকোয়েন্সের সাইডএফেক্টগুলো জোর করে এক্সিকিউট করানো। অর্থাৎ `print-recur` ফাংশনটি লেখা যায় এভাবে:

{% highlight clojure %}
(defn print-recur []
  (loop [i 0]
    (when (< i 5)
      (doall (print-num-seq))
      (recur (inc i)))))
{% endhighlight %}

এবং এবার সবকিছুই প্রিন্ট করবে।
