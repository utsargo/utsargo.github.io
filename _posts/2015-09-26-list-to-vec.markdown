---
title: "লিস্ট থেকে ভেক্টর: এফিশিয়েন্ট উপায়"
date: 2015-09-26 00:15:15 +0600
published: true
layout: post
tags:
- ফাংশনাল প্রোগ্রামিং
- এফিশিয়েন্ট ইডিয়মস্
- ক্লোজার
- যন্ত্রচারী
comments: true
excerpt_separator: <!--more-->
---
কখনো কখনো ক্লোজারে আপনাকে কোন একটি লিস্টকে ভেক্টরে রূপ দিতে হতে পারে। আমরা এখন সবচেয়ে দ্রুত উপয়াটি বের করতে চেষ্টা করবো।

প্রথমেই সবচেয়ে জেনেরিক উপায় অর্থাৎ _into_ ব্যবহার করে দেখি:

{% highlight clojure %}
boot.user> (time (into [] (range 0 101)))
"Elapsed time: 1.235923 msecs"
{% endhighlight %}

আমরা দেখতে পাচ্ছি _into_ ব্যবহার করে আমাদের 1.235923 মিলিসেকেন্ড সময় লেগেছে।
<!--more-->
কিন্তু ভেক্টরে রূপান্তরিত করার জন্য _vec_ নামে একটি ফাংশনই আছে। এবার _vec_ ব্যবহার করে দেখি:

{% highlight clojure %}
boot.user> (time (vec (range 0 101)))
"Elapsed time: 1.824692 msecs"
{% endhighlight %}

দেখা যাচ্ছে, _vec_ ব্যবহার করে সময় আরো বেশি লাগে। এবার আমরা _mapv_ ব্যবহার করছি: 

{% highlight clojure %}
boot.user> (time (mapv identity (range 0 101)))
"Elapsed time: 1.186615 msecs"
{% endhighlight %}

ছোটখাট কাজে নিশ্চিন্তে _vec_ বা _into_ ব্যবহার করা যায়। তবে, বড়সড় লিস্টের ক্ষেত্রে বা কম্পিটিশনে প্রবলেম সলভ করতে, যেখান সময় একটা গুরুত্বপূর্ণ বিষয়, _mapv_ ব্যবহারই শ্রেয়।
