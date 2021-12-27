install.packages("tidyverse")
install.packages("rtweet")
install.packages("textdata")
install.packages("tidytext")
install.packages("wordcloud")
install.packages("wordcloud2")
install.packages("topicmodels")
install.packages("tm")
install.packages("textrecipes")
install.packages("formattable")
install.packages("broom")
install.packages("ranger")
install.packages("yardstick")
install.packages("SnowballC")
install.packages("syuzhet")


library(tidyverse)
library(rtweet)

library(tidytext)
library(lubridate)
library(textdata)

library(RColorBrewer)
library(wordcloud)
library(wordcloud2)

library(topicmodels)
library(tm)
library(textrecipes)
library(formattable)
library(broom)
library(ranger)
library(yardstick)
library(SnowballC)
library(syuzhet)

data<-search_tweets(
  q="#virtualevents",
  n=10000,
  include_rts = FALSE,
  lang="en",
  retryonratelimit = TRUE
)

data<-data%>%flatten()


data%>%write_csv("27_12_21_virtual_events.csv")

#merging and opening all csv files
files<-list.files(pattern="\\.csv$",full.names = TRUE) #read files names with csv
all_data<-map_df(files, ~read_csv(.x)) #open and merge

#duplicate entries
final_data<-data%>%distinct()
final_data%>%write_csv("final_virtual_events.csv")

virtual_events_tweets<-read_csv("final_virtual_events.csv")

virtual_events_tweets<-
  virtual_events_tweets%>%
  mutate(
    timestamp=ymd_hms(created_at),
    day_of_week=wday(timestamp),
    id=as_factor(row_number())
  )

#removing hashtags, urls, special characters
remove_reg <- "&amp;|&lt;|&gt;|\\d+\\w*\\d*|#\\w+|[^\x01-\x7F]|[[:punct:]]|https\\S*"

tidy_tweets <- virtual_events_tweets %>% 
  filter(!str_detect(text, "^RT")) %>%
  mutate(text = str_remove_all(text, remove_reg))

#sentiment libraries
afinn<-get_sentiments("afinn")
bing<-get_sentiments("bing")
nrc<-get_sentiments("nrc")

word.ve<-as.vector(tidy_tweets)

emotion.ve <- get_nrc_sentiment(word.ve)
  get_nrc_sentiment(word.ve)
emotion.ve2<-cbind(tidy_tweets,emotion.ve)



