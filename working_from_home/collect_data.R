library(tidyverse)
library(rtweet)

data<-search_tweets(
  q="remote working",
  n=18000,
  include_rts = FALSE,
  lang="en",
  retryonratelimit = TRUE
)

data<-data%>%flatten()


data%>%write_csv("6_12_21_remote_working.csv")

#to do it when start completing assessment
#merging and opening all csv files
files<-list.files(pattern="\\.csv$",full.names = TRUE) #read files names with csv
all_data<-map_df(files, ~read_csv(.x)) #open and merge

#you may have duplicate entries
final_data<-data%>%distinct()
final_data%>%write_csv("final_remote_working.csv")


library(tidytext)
library(tidyverse)
library(lubridate)
library(textdata)

library(RColorBrewer)
library(wordcloud)
library(wordcloud2)

library(topicmodels)
library(tm)


remote_working_tweets<-read_csv("final_remote_working.csv")

remote_working_tweets<-
  remote_working_tweets%>%
  mutate(
    timestamp=ymd_hms(created_at),
    day_of_week=wday(timestamp),
    id=as_factor(row_number())
  )

#wday(ymd(080101), label = TRUE, abbr = FALSE)
#wday(ymd(080101), label = TRUE, abbr = TRUE)

#explore wday() function

remove_reg <- "&amp;|&lt;|&gt;|\\d+\\w*\\d*|#\\w+|[^\x01-\x7F]|[[:punct:]]|https\\S*"
# &amp = @
# &lt;= <
# &gt; >


#removing retweets characters
tidy_tweets <- remote_working_tweets %>% 
  filter(!str_detect(text, "^RT")) %>%
  mutate(text = str_remove_all(text, remove_reg)) 


#unnesting tweets 
tidy_tweets<-tidy_tweets%>%
  unnest_tokens(word, text, token = "tweets") 

# Remove mentions, urls, emojis, numbers, punctuations, etc.
tidy_tweets<-tidy_tweets%>%
  filter(
    str_detect(word, "[a-z]")#keep only character-words
  )%>%
  anti_join((stop_words))

head(tidy_tweets$word)
#!!!!
#if you want to use stem of the words (e.g. egg instead of eggs) you can use SnowballC::wordStem() option

#install.packages("SnowballC")
#tidy_tweets_stemmed<-tidy_tweets%>% mutate(word=SnowballC::wordStem(word))
#head(tidy_tweets_stemmed$word)

